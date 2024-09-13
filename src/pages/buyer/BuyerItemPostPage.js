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
            /* type: 'text', */
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
            type: 'dropdown',
        },
        {
            accessor: 'itemNm',
            Header: '제품 명',
            type: 'dropdown',
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
                                    <button className='manufacturer-button' onClick={() => setIsPostMode(true)}>추가</button>
                                    <button className='manufacturer-button' onClick={() => {
                                        if (checked.length === 0) {
                                            Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                                            return;
                                        }
                                        console.log('checked: ', checked);
                                        console.log('edited: ', edited);
                                        /* const checkedAndEdited = checked.filter(element => edited.includes(element)); */
                                        const checkedAndEdited = Object.keys(edited)
                                            .filter(key => checked.includes(Number(key)))
                                            .reduce((acc, key) => {
                                                acc[key] = edited[key];
                                                return acc;
                                            }, {});
                                        console.log('checkedAndEdited', checkedAndEdited);

                                        let requestBody = [];
                                        Object.keys(checkedAndEdited).forEach(key => {
                                            const index = Number(key); // key는 문자열이므로 숫자로 변환
                                            const buyerId = data.data[index].buyerId; // data.data 배열에서 해당 인덱스의 원래 데이터를 가져옴
                                            const updatedData = checkedAndEdited[key]; // 수정된 데이터를 가져옴

                                            // 원래 데이터에 수정된 데이터를 덮어씌움 (업데이트된 필드만 반영)
                                            requestBody.push({
                                                buyerId,
                                                ...updatedData
                                            });
                                        });
                                        console.log('requestBody: ', requestBody);
                                        /* sendPatchMultiBuyerRequest(state, requestBody, () => {
                                            sendGetBuyersRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading);
                                            setChecked([]);
                                        }); */
                                    }}>수정</button>
                                    <button className='manufacturer-button'
                                        onClick={() => {
                                            if(checked.length === 0){
                                                Swal.fire({text: "하나 이상의 데이터를 선택해주세요"});
                                                return;
                                              }
                                            console.log('checked: ', checked);
                                            const checkedData = checked.map(item => data.data[item].buyerId);
                                            console.log('checkedData: ', checkedData);
                                            /* sendDeleteBuyersRequest(state, data.pageInfo, checkedData, setChecked, () => {
                                                sendGetBuyersRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading);
                                                setChecked([]);
                                            }); */
                                        }}>삭제</button>
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
                                    setOpened(false);
                                    sendGetMasterBuyerItemsRequest(state, page, 10, resetData, sortBy);
                                });
                            }}
                            page={page}
                            setPage={setPage}
                            sortBy={sortBy}
                            setParentData={(value) => resetData(value)}
                            requestArr={[
                                {key: 'buyerNm', function: (setData) => sendGetBuyersRequest(state, 1, undefined, 9999999, 'buyerNm', (value) => setData(value))},
                                {key: 'itemNm', function: (setData) => sendGetItemsRequest(state, 1, undefined, 9999999, 'itemNm', (value) => setData(value))},
                            ]}
                        ></PostModal> : <div />}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BuyerItemPostPage;