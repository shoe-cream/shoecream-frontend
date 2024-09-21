import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
import PageContainer from '../../components/page_container/PageContainer';
import PostModal from '../../components/modal/PostModal';

import './ManufacturerPostPage.css';
import Sidebar from '../../components/sidebar/Sidebar';
import sendGetManufacturersRequest from '../../requests/GetManufacturersRequest';
import sendPostManufacturersRequest from '../../requests/PostManufacturersRequest';
import sendPatchManufacturersRequest from '../../requests/PatchManufacturersRequest';
import sendDeleteManufacturersRequest from '../../requests/DeleteManufacturersRequest';
import sendGetAllManufacturersRequest from '../../requests/GetAllManufacturersRequest';
import { Plus, Edit, Trash2 } from 'lucide-react';

import SearchWindow from '../../components/search/SearchWindow';

const ManufacturerPostPage = () => {
    const { state } = useAuth();
    const [dbData, setDbData] = useState();
    const [allData, setAllData] = useState({ data: [] });
    const [data, setData] = useState({ data: [] });
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoading2, setIsLoading2 } = useState(true);

    const [checked, setChecked] = useState([]);
    const [isPostMode, setIsPostMode] = useState(false);
    const [edited, setEdited] = useState([]);
    const [sortBy, setSortBy] = useState('mfId');

    const resetData = (value) => {
        console.log('reset data: ', value);
        setData(value);
        setDbData(value);
    }

    useEffect(() => {
        sendGetManufacturersRequest({state: state, page:page, setPage:setPage, size:10, sortBy:sortBy, setData:resetData, setIsLoading:setIsLoading});
        sendGetAllManufacturersRequest(state, setAllData, setIsLoading2);
    }, [page, sortBy]);

    const columnData = [
        {
            accessor: 'mfNm',
            Header: '제조사명',

        },
        {
            accessor: 'mfCd',
            Header: '제조사 코드',
        },
        {
            accessor: 'email',
            Header: '이메일',
            type: 'text',
        },
        {
            accessor: 'region',
            Header: '지역',
            type: 'text',
        },
    ]
    const postColumnData = [
        {
            accessor: 'mfNm',
            Header: '제조사명',
        },
        {
            accessor: 'email',
            Header: '이메일',
            type: 'text',
        },
        {
            accessor: 'region',
            Header: '지역',
        },
    ]

    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                        <h2 className="app-label">제조사 관리</h2>
                        <div className='manufacturer-list-container'>
                            <div className='manufacturer-tool-container'>
                                <select className='custom-select-class'
                                    onChange={(e) => setSortBy(e.target.value)}>
                                    <option disabled='true'>정렬 기준 선택</option>
                                    <option value={'itemCd'}>제품코드</option>
                                    <option value={'itemNm'}>제품명</option>
                                    <option value={'createdAt'}>등록순</option>
                                    <option value={'unitPrice'}>단가순</option>
                                </select>
                                <SearchWindow
                                    placeholder='제조사 이름으로 검색'
                                    suggestions={
                                        allData.data.map(data => ({
                                            key: data.mfNm,
                                            onSearch: () => {
                                                /* const mfNm = data.mfNm.replace(/\s+/g, ''); */
                                                const mfNm = data.mfNm;
                                                console.log('data: ', data);
                                                console.log('mfNm: ', data.mfNm);
                                                sendGetManufacturersRequest(
                                                    { state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, mfNm: mfNm, setData: resetData, setIsLoading: setIsLoading }
                                                );
                                            }
                                        }))
                                    }
                                    defaultSearch={() => {
                                        sendGetManufacturersRequest(
                                            { state: state, page: page, setPage: setPage, size: 10, sortBy: sortBy, setData: resetData, setIsLoading: setIsLoading }
                                        )
                                    }}
                                />
                                <div />
                                <div className='manufacturer-button-container'>
                                    <button className='manufacturer-button' onClick={() => setIsPostMode(true)}>
                                        <Plus size={16} /> 추가
                                    </button>
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

                                        if (Object.keys(checkedAndEdited).length === 0) {
                                            Swal.fire({ text: '변경된 데이터가 없습니다' });
                                            setChecked([]);
                                            return;
                                        }

                                        let requestBody = [];
                                        Object.keys(checkedAndEdited).forEach(key => {
                                            const index = Number(key); // key는 문자열이므로 숫자로 변환
                                            const mfId = data.data[index].mfId; // data.data 배열에서 해당 인덱스의 원래 데이터를 가져옴
                                            const updatedData = checkedAndEdited[key]; // 수정된 데이터를 가져옴

                                            // 원래 데이터에 수정된 데이터를 덮어씌움 (업데이트된 필드만 반영)
                                            requestBody.push({
                                                mfId,
                                                ...updatedData
                                            });
                                        });
                                        console.log('requestBody: ', requestBody);
                                        sendPatchManufacturersRequest(state, requestBody, () => {
                                            sendGetManufacturersRequest({state:state, page:page, setPage:setPage, size:10, sortBy:sortBy, setData:resetData});
                                            setChecked([]);
                                        });
                                    }}>
                                        <Edit size={16} /> 수정
                                    </button>
                                    <button className='manufacturer-button'
                                        onClick={() => {
                                            if (checked.length === 0) {
                                                Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                                                return;
                                            }
                                            /* console.log('checked: ', checked); */
                                            const checkedItems = checked.map(item => data.data[item].mfId);
                                            sendDeleteManufacturersRequest(state, checkedItems, setChecked, () => {
                                                sendGetManufacturersRequest({state:state, page:page, setPage:setPage, size:10, sortBy:sortBy, setData:resetData});
                                                setChecked([]);
                                            });
                                        }}>
                                        <Trash2 size={16} /> 삭제
                                    </button>
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
                        {isLoading || isLoading2 ? <div /> : <PageContainer
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
                                sendPostManufacturersRequest(state, checkedData, () => {
                                    setChecked([]);
                                    setOpened(false);
                                    sendGetManufacturersRequest({state:state, page:page, setPage:setPage, size:10, sortBy:sortBy, setData:resetData});
                                });
                            }}
                            page={page}
                            setPage={setPage}
                            sortBy={sortBy}
                            setParentData={(value) => resetData(value)}
                        ></PostModal> : <div />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManufacturerPostPage;