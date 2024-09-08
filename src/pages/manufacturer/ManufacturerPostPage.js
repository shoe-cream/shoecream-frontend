import { useMemo } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTable from '../../components/Table/ReactTable';
import './ManufacturerPostPage.css';
import ReactTableWithCheckbox from '../../components/Table/ReactTableWithCheckbox';

const ManufacturerContent = ({ leftContent, rightContent }) => {
    return (
        <div className='manufacturer-content-container'>
            <div className='manufacturer-content'>
                <div className='manufacturer-content-name'>{leftContent}</div>
                <input className='manufacturer-content-input'></input>
            </div>
            <div className='manufacturer-content'>
                <div className='manufacturer-content-name'>{rightContent}</div>
                <input className='manufacturer-content-input'></input>
            </div>
        </div>
    );
}


const ManufacturerPostPage = () => {
    const columnData = [
        {
          accessor: 'manufacturerName',
          Header: '제조사 명',
        },
        {
          accessor: 'manufacturerCode',
          Header: '제조사 코드',
        },
        {
          accessor: 'businessType',
          Header: '사업자 구분',
        },
        {
          accessor: 'contactPerson',
          Header: '담당자 연락처',
        },
        {
          accessor: 'email',
          Header: '담당자 이메일',
        },
        {
          accessor: 'address',
          Header: '주소',
        }
    ];
    
    const columns = useMemo(() => columnData, []);
    
    const data = useMemo(() => [
      {
        "manufacturerName": "ABC Corp",          // 제조사 명
        "manufacturerCode": "M001",              // 제조사 코드
        "businessType": "제조업",                 // 사업자 구분
        "contactPerson": "김철수",               // 담당자 연락처
        "email": "chulsu.kim@abccorp.com",       // 담당자 이메일
        "address": "서울시 강남구 테헤란로 123"   // 주소
      },
      {
        "manufacturerName": "XYZ Industries",    // 제조사 명
        "manufacturerCode": "M002",              // 제조사 코드
        "businessType": "유통업",                 // 사업자 구분
        "contactPerson": "이영희",               // 담당자 연락처
        "email": "younghee.lee@xyzind.com",      // 담당자 이메일
        "address": "부산시 해운대구 센텀중앙로 456" // 주소
      },
      {
        "manufacturerName": "Techno Solutions",  // 제조사 명
        "manufacturerCode": "M003",              // 제조사 코드
        "businessType": "IT 서비스",              // 사업자 구분
        "contactPerson": "박민수",               // 담당자 연락처
        "email": "minsu.park@technosol.com",     // 담당자 이메일
        "address": "대전시 유성구 대덕대로 789"   // 주소
      }
    ], []);

    return (
        <div>
            <Header></Header>
            <div className='app-container'>
                <Sidebar></Sidebar>
                <div className='app-content-container'>
                    <div className='app-background'>
                        <div className='manufacturer-input-container'>
                            <div className='manufacturer-input-header'>
                                <div className='manufacturer-input-text'>제조사 정보 등록</div>
                                <button className='manufacturer-input-button'>등록</button>
                            </div>
                            <ManufacturerContent leftContent='제조사 명' rightContent='담당자 연락처'></ManufacturerContent>
                            <ManufacturerContent leftContent='제조사 코드' rightContent='담당자 이메일'></ManufacturerContent>
                            <ManufacturerContent leftContent='사업자 구분' rightContent='주소'></ManufacturerContent>
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
                            <ReactTableWithCheckbox columns={columnData} data={data}></ReactTableWithCheckbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ManufacturerPostPage;