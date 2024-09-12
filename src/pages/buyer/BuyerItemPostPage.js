import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';
import { columnData, data } from '../../data/ManufacturerData';
import PostContainer from '../../components/postcontainer/PostContainer';
import { useState } from 'react';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';

const BuyerItemPostPage = () => {
    const [dbData, setDbData] = useState();
    const [data, setData] = useState({data:[]});
    const [checked, setChecked] = useState([]);
    const [edited, setEdited] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
export default BuyerItemPostPage;