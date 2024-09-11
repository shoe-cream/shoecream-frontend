import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import { columnData } from '../../data/ItemData';
import PostContainer from '../../components/postcontainer/PostContainer';
import { useEffect, useState } from 'react';
import sendPostItemRequest from '../../requests/PostItemRequest';
import { useAuth } from '../../auth/AuthContext';
import sendGetItemsRequest from '../../requests/GetItemsRequest';
import PageContainer from '../../components/page_container/PageContainer';
import sendDeleteItemRequest from '../../requests/DeleteItemRequest';
import PostModal from '../../components/modal/PostModal';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
import sendPostMultiItemRequest from '../../requests/PostMultiItemRequest';
import sendPatchMultiItemRequest from '../../requests/PatchMultiItemsRequest';

const ItemPostPage = () => {
    const { state } = useAuth();
    const [dbItems, setDbItems] = useState();
    const [items, setItems] = useState({data:[]});
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [nameInput, setNameInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [unitInput, setUnitInput] = useState('');
    const [unitpriceInput, setUnitpriceInput] = useState('');
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');

    const [checked, setChecked] = useState([]);
    const [isPostMode, setIsPostMode] = useState(false);
    const [edited, setEdited] = useState([]);

    /* console.log('edited: ', edited); */
    console.log('items in page: ', items);

    const handleRowSelect = (rowId) => {
        setChecked(prev => 
        prev.includes(rowId)
            ? prev.filter(id => id !== rowId)
            : [...prev, rowId]
        );
    };

    const addItem = () => {
        if(nameInput === ''){
            alert('제품명을 입력해주세요');
            return;
        }
        if(sizeInput === ''){
            alert('사이즈를 입력해주세요');
            return;
        }
        if(codeInput === ''){
            alert('제품 코드를 입력해주세요');
            return;
        }
        if(colorInput === ''){
            alert('색상을 입력해주세요');
            return;
        }
        if(categoryInput === ''){
            alert('카테고리를 입력해주세요');
            return;
        }
        if(unitpriceInput === ''){
            alert('단가를 입력해주세요');
            return;
        }
        if(unitInput === ''){
            alert('단위를 입력해주세요');
            return;
        }
        sendPostItemRequest(state, nameInput, codeInput, unitInput, unitpriceInput, sizeInput, colorInput, categoryInput, 
            () => sendGetItemsRequest(state, 1, setPage, 10, setItems, setIsLoading));
        setNameInput('');
        setCodeInput('');
        setUnitInput('');
        setUnitpriceInput('');
        setColorInput('');
        setSizeInput('');
        setCategoryInput('');
    }

    const resetData = (value) => {
        console.log('reset data: ', value);
        setItems(value);
        setDbItems(value);
    }

    useEffect(() => {
        sendGetItemsRequest(state, page, setPage, 10, resetData, setIsLoading);
    }, [page]);

    const columnData = [
        {
          accessor: 'itemNm',
          Header: '상품명',
          editable: true,
        },
        {
          accessor: 'itemCd',
          Header: '상품 코드',
          editable: false,
        },
        {
          accessor: 'category',
          Header: '카테고리',
          editable: false,
        },
        {
          accessor: 'color',
          Header: '색상',
          editable: false,
        },
        {
          accessor: 'size',
          Header: '사이즈',
          editable: false,
        },
        {
          accessor: 'unit',
          Header: '단위',
          editable: true,
        },
        {
          accessor: 'unitPrice',
          Header: '단가',
          editable: true,
        },
      ]

    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                        <div className='manufacturer-list-container'>
                            <div className='manufacturer-tool-container'>
                                {/* <select>
                                    <option disabled='true'>Filter By</option>
                                    <option>최신순</option>
                                    <option>무슨순</option>
                                    <option>무슨순2</option>
                                </select> */}
                                <div/>
                                <div className='manufacturer-button-container'>
                                    <button className='manufacturer-button' onClick={() => setIsPostMode(true)}>추가</button>
                                    <button className='manufacturer-button' onClick= {() => {
                                        /* console.log('checked: ', checked);
                                        console.log('edited: ', edited); */
                                        const checkedAndEdited = checked.filter(element => edited.includes(element));
                                        /* console.log('checkedAndEdited', checkedAndEdited); */

                                        let requestBody = [];
                                        for(let i = 0; i< checkedAndEdited.length; i++){
                                            requestBody.push(items.data[checkedAndEdited[i]]);
                                        }
                                        /* console.log('requestBody: ', requestBody); */
                                        sendPatchMultiItemRequest(state, requestBody, () => {
                                            sendGetItemsRequest(state, page, setPage, 10, resetData, setIsLoading);
                                            setChecked([]);
                                        });

                                    }}>수정</button>
                                    <button className='manufacturer-button'
                                        onClick={() => {
                                            /* console.log('checked: ', checked); */
                                            const checkedItems = checked.map(item => items.data[item].itemId);
                                            sendDeleteItemRequest(state, items.pageInfo, checkedItems, setChecked, () => {
                                                    sendGetItemsRequest(state, page, setPage, 10, resetData, setIsLoading);
                                                    setChecked([]);
                                                });
                                        }}>삭제</button>
                                </div>
                            </div>
                            {isLoading ? <div/> : <EditableTableWithCheckbox 
                                columns={columnData} 
                                ogData={dbItems}
                                data={items} 
                                setData={(data) => setItems(data)}
                                checked = {checked} 
                                setChecked={setChecked}
                                edited = {edited}
                                setEdited={setEdited}
                                >
                            </EditableTableWithCheckbox>}
                        </div>
                        {isLoading ? <div/> : <PageContainer 
                            currentPage={page} 
                            setPage={setPage}
                            pageInfo={items.pageInfo}
                            getPage={(page) => {
                                sendGetItemsRequest(state, page, setPage, 10, resetData, setIsLoading)
                            }}
                            setChecked={(value) => setChecked(value)}
                            reloading = {() => setIsLoading(true)}
                        ></PageContainer>}
                        {isPostMode ? <PostModal 
                            state = {state} 
                            setOpened = {setIsPostMode} 
                            columnData={columnData}
                            page={page}
                            setPage={setPage}
                            setParentData={(value) => resetData(value)}
                        ></PostModal> : <div/>}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ItemPostPage;