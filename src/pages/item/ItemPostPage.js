import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import { columnData } from '../../data/ItemData';
import PostContainer from '../../components/postcontainer/PostContainer';
import { useEffect, useState } from 'react';
import sendPostItemRequest from '../../requests/PostItemRequest';
import { useAuth } from '../../auth/AuthContext';
import sendGetItemsRequest from '../../requests/GetItemsRequest';

const ItemPostPage = () => {
    const { state } = useAuth();
    const [items, setItems] = useState({data:[]});
    const [isLoading, setIsLoading] = useState(true);
    const [nameInput, setNameInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [unitInput, setUnitInput] = useState('');
    const [unitpriceInput, setUnitpriceInput] = useState(0);
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');

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
        sendPostItemRequest(state, nameInput, codeInput, unitInput, unitpriceInput, sizeInput, colorInput, categoryInput);
    }

    useEffect(() => {
        sendGetItemsRequest(state, 1, 10, setItems, setIsLoading);
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
                            <PostContainer leftContent='제품명' rightContent='사이즈' setLeftInput={(value) => setNameInput(value)} setRightInput={(value) => setSizeInput(value)}></PostContainer>
                            <PostContainer leftContent='제품 코드' rightContent='색상'setLeftInput={(value) => setCodeInput(value)} setRightInput={(value) => setColorInput(value)}></PostContainer>
                            <PostContainer leftContent='카테고리' rightContent='단가'setLeftInput={(value) => setCategoryInput(value)} setRightInput={(value) => setUnitpriceInput(value)}></PostContainer>
                            <PostContainer leftContent='단위'setLeftInput={(value) => setUnitInput(value)}></PostContainer>
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
                                    <button className='manufacturer-button'>삭제</button>
                                </div>
                            </div>
                            <ReactTableWithCheckbox columns={columnData} data={items.data}></ReactTableWithCheckbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ItemPostPage;