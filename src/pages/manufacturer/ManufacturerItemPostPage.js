import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import './ManufacturerItemPostPage.css';

import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
import PageContainer from '../../components/page_container/PageContainer';
import PostModal from '../../components/modal/PostModal';
import Swal from 'sweetalert2';
import sendGetAllItemsRequest from '../../requests/GetAllItemsRequest';
import sendGetManufacturerItemsRequest from '../../requests/GetManufacturerItemsRequest';
import sendGetAllManufacturersRequest from '../../requests/GetAllManufacturersRequest';
import sendPostManufacturerItemsRequest from '../../requests/PostManufacturerItemsRequest';
import sendPatchManufacturerItemsRequest from '../../requests/PatchManufacturerItemsRequest';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DropdownSearchWindow from '../../components/search/DropdownSearchWindow';

const ManufacturerItemPostPage = () => {
    const { state } = useAuth();
    const [page, setPage] = useState(1);
    const [dbData, setDbData] = useState();
    const [data, setData] = useState({ data: [] });
    const [checked, setChecked] = useState([]);
    const [edited, setEdited] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoading2, setIsLoading2] = useState(true);
    const [isLoading3, setIsLoading3] = useState(true);
    const [sortBy, setSortBy] = useState('mfItemId');
    const [isPostMode, setIsPostMode] = useState(false);
    const [allManufacturers, setAllManufacturers] = useState({data:[]});
    const [allItems, setAllItems] = useState({data:[]});
    const columnData = [
        {
            accessor: 'mfNm',
            Header: '제조사 명',
        },
        {
            accessor: 'mfCd',
            Header: '제조사 코드',
        },
        {
            accessor: 'region',
            Header: '지역',
        },
        {
            accessor: 'itemNm',
            Header: '제품 명',
            type: 'cell',
        },
        {
            accessor: 'itemCd',
            Header: '제품 코드',
            type: 'cell',
        },
        {
            accessor: 'qty',
            Header: '수량',
            /* type: 'number', */
        },
        {
            accessor: 'unitPrice',
            Header: '단가',
        },
    ]
    const postColumnData = [
        {
            accessor: 'mfNm',
            Header: '제조사 명',
            type: 'search-input',
            placeholder: '제조사명으로 검색',
        },
        {
            accessor: 'itemNm',
            Header: '제품 명',
            type: 'search-input',
            placeholder: '제품명으로 검색',
        },
        {
            accessor: 'qty',
            Header: '수량',
            type: 'number',
        },
        {
            accessor: 'unitPrice',
            Header: '단가',
            type: 'number',
        },
        /* {
            accessor: 'startDate',
            Header: '적용 시작일',
            type: 'date',
        },
        {
            accessor: 'endDate',
            Header: '적용 종료일',
            type: 'date',
        }, */
    ]

    const resetData = (value) => {
        console.log('reset data: ', value);
        setData(value);
        setDbData(value);
    }
    useEffect(() => {
        sendGetManufacturerItemsRequest({state:state, page:page, size:10, setData:resetData, sort:sortBy, setIsLoading:setIsLoading});
        sendGetAllManufacturersRequest(state, setAllManufacturers, setIsLoading2);
        sendGetAllItemsRequest(state, setAllItems, setIsLoading3);
    }, [page, sortBy]);
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                        <h2 className="app-label">납품 관리</h2>
                        <div className='manufacturer-list-container'>
                            <div className='manufacturer-tool-container'>
                                <select onChange={(e) => setSortBy(e.target.value)}>
                                    <option disabled='true'>정렬 기준 선택</option>
                                    <option value='mfItemId'>ID</option>
                                    {/* <option value='buyerId'>등록순</option> */}
                                    <option value='manufacturer.mfCd'>고객사별</option>
                                    <option value='unitPrice'>단가순</option>
                                    <option value='startDate'>적용 시작일순</option>
                                    <option value='endDate'>적용 종료일순</option>
                                    <option value='modifiedAt'>최신 수정순</option>
                                </select>
                                <DropdownSearchWindow types={[
                                    {
                                        value: 'mfNm', display: '제조사명', placeholder: '제조사 이름으로 검색',
                                        suggestions: allManufacturers.data.map(manufacturer => (
                                            { key: manufacturer.mfNm, onSearch: () => {
                                                /* const mfNm = manufacturer.mfNm.replace(/\s+/g, ''); */
                                                const mfNm = manufacturer.mfNm;
                                                sendGetManufacturerItemsRequest({ state: state, page: page, size: 10, mfNm: mfNm, setData: resetData, sort: sortBy })} }
                                        )),
                                        defaultSearch: () => sendGetManufacturerItemsRequest({ state: state, page: page, size: 10, setData: resetData, sort: sortBy })
                                    },
                                    {
                                        value: 'itemNm', display: '제품명', placeholder: '제품 이름으로 검색',
                                        suggestions: allItems.data.map(item => (
                                            { key: item.itemNm, onSearch: () => {
                                                /* const itemNm = item.itemNm.replace(/\s+/g, ''); */
                                                const itemNm = item.itemNm;
                                                sendGetManufacturerItemsRequest({ state: state, page: page, size: 10, itemNm: itemNm, setData: resetData, sort: sortBy })} }
                                        )),
                                        defaultSearch: () => sendGetManufacturerItemsRequest({ state: state, page: page, size: 10, setData: resetData, sort: sortBy })
                                    },
                                ]} />
                                <div className='manufacturer-button-container'>
                                    <button className='manufacturer-button' onClick={() => setIsPostMode(true)}><Plus size={16} /> 추가</button>
                                    {/* <button className='manufacturer-button' onClick={() => {
                                        if (checked.length === 0) {
                                            Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                                            return;
                                        }
                                        console.log('checked: ', checked);
                                        console.log('edited: ', edited);

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
                                            const mfItemId = data.data[index].mfItemId; // data.data 배열에서 해당 인덱스의 원래 데이터를 가져옴
                                            const updatedData = checkedAndEdited[key]; // 수정된 데이터를 가져옴

                                            // 원래 데이터에 수정된 데이터를 덮어씌움 (업데이트된 필드만 반영)
                                            requestBody.push({
                                                mfItemId,
                                                ...updatedData
                                            });
                                        });
                                        console.log('requestBody: ', requestBody);
                                        sendPatchManufacturerItemsRequest(state, requestBody, () => {
                                            sendGetManufacturerItemsRequest(state, page, 10, resetData, sortBy, setIsLoading);
                                            setChecked([]);
                                        });
                                    }}><Edit size={16} /> 수정</button> */}
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
                        {isLoading || isLoading2 || isLoading3 ? <div /> : <PageContainer
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
                                sendPostManufacturerItemsRequest(state, checkedData, () => {
                                    setChecked([]);
                                    setOpened(false);
                                    sendGetManufacturerItemsRequest({state: state, page: page, size: 10, setData: resetData, sort: sortBy, setIsLoading: setIsLoading});
                                });
                            }}
                            page={page}
                            setPage={setPage}
                            sortBy={sortBy}
                            setParentData={(value) => resetData(value)}
                            requestArr={[
                                /* {key: 'buyerNm', function: (setData) => sendGetBuyersRequest(state, 1, undefined, 9999999, 'buyerNm', (value) => setData(value))}, */
                                { key: 'buyerNm', function: (setData) => sendGetAllManufacturersRequest(state, (value) => setData(value)) },
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
export default ManufacturerItemPostPage;