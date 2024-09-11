import Header from "../../components/header/Header";
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from "../../components/Table/ReactTableWithCheckbox";
import { columnData, data } from "../../data/ManufacturerData";
import PostContainer from "../../components/postcontainer/PostContainer";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import EditableTableWithCheckbox from "../../components/Table/EditableTableWithCheckbox";

const BuyerPostPage = () => {
    const { state } = useAuth();
    const [dbData, setDbData] = useState();
    const [data, setData] = useState({data:[]});
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const [checked, setChecked] = useState([]);
    const [isPostMode, setIsPostMode] = useState(false);
    const [edited, setEdited] = useState([]);

    const columnData = [
        {
          accessor: 'buyerCd',
          Header: '고객사 코드',
          editable: false,
        },
        {
          accessor: 'email',
          Header: '이메일',
          editable: true,
        },
        {
          accessor: 'buyerNm',
          Header: '고객사 명',
          editable: true,
        },
        {
          accessor: 'tel',
          Header: '전화번호',
          editable: true,
        },
        {
          accessor: 'address',
          Header: '주소',
          editable: true,
        },
        {
          accessor: 'businessType',
          Header: '사업 분류',
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
                <div className="app-content-container">
                    <div className="app-background">
                        
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
                                            requestBody.push(data.data[checkedAndEdited[i]]);
                                        }
                                        console.log('requestBody: ', requestBody);
                                        /* sendPatchMultiItemRequest(state, requestBody, () => {
                                            sendGetItemsRequest(state, page, setPage, 10, resetData, setIsLoading);
                                            setChecked([]);
                                        }); */
                                    }}>수정</button>
                                    <button className='manufacturer-button'
                                        onClick={() => {
                                            /* console.log('checked: ', checked); */
                                            const checkedItems = checked.map(item => data.data[item].itemId);
                                            /* sendDeleteItemRequest(state, items.pageInfo, checkedItems, setChecked, () => {
                                                    sendGetItemsRequest(state, page, setPage, 10, resetData, setIsLoading);
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
                                checked = {checked} 
                                setChecked={setChecked}
                                edited = {edited}
                                setEdited={setEdited}
                                >
                            </EditableTableWithCheckbox>
                            {isLoading ? <div/> : <ReactTableWithCheckbox columns={columnData} data={data}></ReactTableWithCheckbox>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BuyerPostPage;