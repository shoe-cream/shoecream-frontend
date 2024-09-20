import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
import sendGetMasterBuyerItemsRequest from '../../requests/GetMasterBuyerItems';
import PageContainer from '../../components/page_container/PageContainer';
import PostModal from '../../components/modal/PostModal';
import Swal from 'sweetalert2';
import sendGetBuyersRequest from '../../requests/GetBuyersRequest';
import sendGetItemsRequest from '../../requests/GetItemsRequest';
import sendPostBuyerItemsRequest from '../../requests/PostBuyerItemsRequest';
import sendGetAllBuyersRequest from '../../requests/GetAllBuyersRequest';
import sendGetAllItemsRequest from '../../requests/GetAllItemsRequest';
import sendPatchMultiBuyerItemsRequest from '../../requests/PatchMultiBuyerItemsRequest';
import './BuyerItemPostPage.css';
import { Plus, Edit, Trash2 } from 'lucide-react';

const BuyerItemPostPage = () => {
    const { state } = useAuth();
    const [page, setPage] = useState(1);
    const [dbData, setDbData] = useState();
    const [data, setData] = useState({ data: [] });
    const [checked, setChecked] = useState([]);
    const [edited, setEdited] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('buyerItemId');
    const [isPostMode, setIsPostMode] = useState(false);

    const columnData = [
        {
            accessor: 'buyerNm',
            Header: '고객사 명',
        },
        {
            accessor: 'buyerCd',
            Header: '고객사 코드',
        },
        {
            accessor: 'itemCd',
            Header: '제품 코드',
            type: 'cell',
        },
        {
            accessor: 'itemNm',
            Header: '제품 명',
            type: 'cell',
        },
        {
            accessor: 'unitPrice',
            Header: '단가',
            type: 'number',
        },
        {
            accessor: 'unit',
            Header: '단위',
            type: 'text',
        },
        {
            accessor: 'startDate',
            Header: '적용 시작일',
            type: 'date',
        },
        {
            accessor: 'endDate',
            Header: '적용 종료일',
            type: 'date',
        },
    ]
    const postColumnData = [
        {
            accessor: 'buyerNm',
            Header: '고객사 명',
            type: 'search-input',
            placeholder: '고객사명으로 검색',
        },
        {
            accessor: 'itemNm',
            Header: '제품 명',
            type: 'search-input',
            placeholder: '제품명으로 검색',
        },
        {
            accessor: 'unitPrice',
            Header: '단가',
            type: 'number',
        },
        {
            accessor: 'startDate',
            Header: '적용 시작일',
            type: 'date',
        },
        {
            accessor: 'endDate',
            Header: '적용 종료일',
            type: 'date',
        },
    ]

    const resetData = (value) => {
        console.log('reset data: ', value);
        setData(value);
        setDbData(value);
    }
    useEffect(() => {
        sendGetMasterBuyerItemsRequest(state, page, 10, resetData, sortBy, setIsLoading);
    }, [page, sortBy]);
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                        <h2 className="app-label">고객사 단가 관리</h2>
                        <div className='manufacturer-list-container'>
                            <div className='manufacturer-tool-container'>
                                <select onChange={(e) => setSortBy(e.target.value)}>
                                    <option disabled='true'>정렬 기준 선택</option>
                                    <option value='buyerItemId'>ID</option>
                                    {/* <option value='buyerId'>등록순</option> */}
                                    <option value='buyer.buyerCd'>고객사별</option>
                                    <option value='unitPrice'>단가순</option>
                                    <option value='startDate'>적용 시작일순</option>
                                    <option value='endDate'>적용 종료일순</option>
                                    <option value='modifiedAt'>최신 수정순</option>
                                </select>
                                <div className='manufacturer-button-container'>
                                    <button className='manufacturer-button' onClick={() => setIsPostMode(true)}><Plus size={16} /> 추가</button>
                                    <button className='manufacturer-button' onClick={() => {
                                        if (checked.length === 0) {
                                            Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                                            return;
                                        }
                                        console.log('checked: ', checked);
                                        console.log('edited: ', edited);

                                        let areDatesValid = true;

                                        Object.keys(edited).forEach((key) => {
                                            const row = edited[key]; 
                                            const index = parseInt(key, 10); 
                                            const startDateChanged = 'startDate' in row;
                                            const endDateChanged = 'endDate' in row;

                                            console.log('startDateChanged: ', startDateChanged);
                                            console.log('endDateChanged: ', endDateChanged);
                                        
                                            if (startDateChanged && endDateChanged) {
                                                if (new Date(row.startDate) > new Date(row.endDate)) {
                                                    Swal.fire({
                                                        text: `${index}번째 행에서 오류 발생: 종료일이 시작일보다 앞설 수 없습니다.`
                                                    });
                                                    areDatesValid = false;
                                                    return;
                                                }
                                            }
                                            console.log('rowStartDate: ', row.startDate);
                                            console.log('rowEndDate: ', row.endDate);
                                            console.log('dbStartDate: ', dbData.data[index].startDate);
                                            console.log('dbEndDate: ', dbData.data[index].endDate);
                                            if (
                                                (startDateChanged && new Date(row.startDate) > new Date(dbData.data[index].endDate)) ||
                                                (endDateChanged && new Date(dbData.data[index].startDate) > new Date(row.endDate))
                                            ) {
                                                console.log('dbEndDate: ', dbData.data[index].endDate);
                                                Swal.fire({
                                                    text: `${index + 1}번째 행에서 오류 발생: 종료일이 시작일보다 앞설 수 없습니다.`
                                                });
                                                areDatesValid = false;
                                                return;
                                            }
                                        });
                                        if(!areDatesValid){
                                            return;
                                        }
                                        /* const checkedAndEdited = checked.filter(element => edited.includes(element)); */
                                        const checkedAndEdited = Object.keys(edited)
                                            .filter(key => checked.includes(Number(key)))
                                            .reduce((acc, key) => {
                                                acc[key] = edited[key];
                                                return acc;
                                            }, {});
                                        console.log('checkedAndEdited', checkedAndEdited);

                                        if (Object.keys(checkedAndEdited).length === 0) {
                                            Swal.fire({ text: '변경된 데이터가 없습니다' });
                                            setChecked([]);
                                            return;
                                          }

                                        let requestBody = [];
                                        Object.keys(checkedAndEdited).forEach(key => {
                                            const index = Number(key); // key는 문자열이므로 숫자로 변환
                                            const buyerItemId = data.data[index].buyerItemId; // data.data 배열에서 해당 인덱스의 원래 데이터를 가져옴
                                            const updatedData = checkedAndEdited[key]; // 수정된 데이터를 가져옴

                                            // 원래 데이터에 수정된 데이터를 덮어씌움 (업데이트된 필드만 반영)
                                            requestBody.push({
                                                buyerItemId,
                                                ...updatedData
                                            });
                                        });
                                        console.log('requestBody: ', requestBody);
                                        sendPatchMultiBuyerItemsRequest(state, requestBody, () => {
                                            sendGetMasterBuyerItemsRequest(state, page, 10, resetData, sortBy, setIsLoading);
                                            setChecked([]);
                                        });
                                    }}><Edit size={16} /> 수정</button>
                                    {/* {<button className='manufacturer-button'
                                        onClick={() => {
                                            if (checked.length === 0) {
                                                Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                                                return;
                                            }
                                            console.log('checked: ', checked);
                                            const checkedData = checked.map(item => data.data[item].buyerId);
                                            console.log('checkedData: ', checkedData);
                                            
                                        }}>삭제</button>} */}
                                </div>
                            </div>
                            <EditableTableWithCheckbox
                                columns={columnData}
                                ogData={dbData}
                                data={data}
                                setData={(data) => setData(data)}
                                checked={checked}
                                setChecked={setChecked}
                                edited={edited}
                                setEdited={setEdited}
                            >
                            </EditableTableWithCheckbox>
                        </div>
                        {isLoading ? <div /> : <PageContainer
                            currentPage={page}
                            setPage={setPage}
                            pageInfo={data.pageInfo}
                            getPage={(page) => {
                                /* sendGetItemsRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading); */
                            }}
                            setChecked={(value) => setChecked(value)}
                            setIsLoading={setIsLoading}
                        ></PageContainer>}
                        {isPostMode ? <PostModal
                            state={state}
                            setOpened={setIsPostMode}
                            columnData={postColumnData}
                            postRequest={(checkedData, setOpened, setParentData) => {
                                sendPostBuyerItemsRequest(state, checkedData, () => {
                                    setChecked([]);
                                    setOpened(false);
                                    sendGetMasterBuyerItemsRequest(state, page, 10, resetData, sortBy);
                                });
                            }}
                            page={page}
                            setPage={setPage}
                            sortBy={sortBy}
                            setParentData={(value) => resetData(value)}
                            requestArr={[
                                /* {key: 'buyerNm', function: (setData) => sendGetBuyersRequest(state, 1, undefined, 9999999, 'buyerNm', (value) => setData(value))}, */
                                { key: 'buyerNm', function: (setData) => sendGetAllBuyersRequest(state, (value) => setData(value)) },
                                /* {key: 'itemNm', function: (setData) => sendGetItemsRequest(state, 1, undefined, 9999999, 'itemNm', (value) => setData(value))}, */
                                { key: 'itemNm', function: (setData) => sendGetAllItemsRequest(state, (value) => setData(value)) },
                            ]}
                        ></PostModal> : <div />}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BuyerItemPostPage;