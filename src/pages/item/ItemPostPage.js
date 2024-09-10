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

const ItemPostPage = () => {
    const { state } = useAuth();
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
            () => sendGetItemsRequest(state, 1, 10, setItems, setIsLoading));
        setNameInput('');
        setCodeInput('');
        setUnitInput('');
        setUnitpriceInput('');
        setColorInput('');
        setSizeInput('');
        setCategoryInput('');
    }

    useEffect(() => {
        sendGetItemsRequest(state, page, 10, setItems, setIsLoading);
    }, []);

    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                        <div className='manufacturer-input-container'>
                            <div className='manufacturer-input-header'>
                                <div className='manufacturer-input-text'>제품 등록</div>
                                <button className='manufacturer-input-button'
                                onClick={() => addItem()}
                                >등록</button>
                            </div>
                            <PostContainer 
                                leftContent='제품명' rightContent='사이즈' 
                                leftInput = {nameInput} setLeftInput={(value) => setNameInput(value)}
                                rightInput = {sizeInput} setRightInput={(value) => setSizeInput(value)}></PostContainer>
                            <PostContainer
                                leftContent='제품 코드' rightContent='색상'
                                leftInput = {codeInput} setLeftInput={(value) => setCodeInput(value)}
                                rightInput = {colorInput} setRightInput={(value) => setColorInput(value)}></PostContainer>
                            <PostContainer
                                leftContent='카테고리' rightContent='단가'
                                leftInput = {categoryInput} setLeftInput={(value) => setCategoryInput(value)}
                                rightInput = {unitpriceInput} setRightInput={(value) => setUnitpriceInput(value)}></PostContainer>
                            <PostContainer 
                                leftContent='단위' setLeftInput={(value) => setUnitInput(value)}
                                leftInput={unitInput}
                                ></PostContainer>
                        </div>
                        <div className='manufacturer-list-container'>
                            <div className='manufacturer-tool-container'>
                                <select>
                                    <option disabled='true'>Filter By</option>
                                    <option>최신순</option>
                                    <option>무슨순</option>
                                    <option>무슨순2</option>
                                </select>
                                <div className='manufacturer-button-container'>
                                    <button className='manufacturer-button'>수정</button>
                                    <button className='manufacturer-button'
                                        onClick={() => {
                                            console.log('checked: ', checked);
                                            sendDeleteItemRequest(state, items.pageInfo, checked, setChecked, () => sendGetItemsRequest(state, page, 10, setItems, setIsLoading));
                                        }}>삭제</button>
                                </div>
                            </div>
                            <ReactTableWithCheckbox 
                                columns={columnData} 
                                data={items.data} 
                                checked = {checked} 
                                setChecked={setChecked}>
                            </ReactTableWithCheckbox>
                        </div>
                        {isLoading ? <div/> : <PageContainer 
                            currentPage={page} 
                            setPage={setPage}
                            pageInfo={items.pageInfo}
                            getPage={(page) => {
                                sendGetItemsRequest(state, page, 10, setItems, setIsLoading)
                            }}
                            setChecked={(value) => setChecked(value)}
                        ></PageContainer>}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ItemPostPage;