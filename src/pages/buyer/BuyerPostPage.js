import Header from "../../components/header/Header";
import Sidebar from '../../components/sidebar/Sidebar';
import ReactTableWithCheckbox from "../../components/Table/ReactTableWithCheckbox";
import { columnData, data } from "../../data/ManufacturerData";
import PostContainer from "../../components/postcontainer/PostContainer";
import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import EditableTableWithCheckbox from "../../components/Table/EditableTableWithCheckbox";
import PageContainer from "../../components/page_container/PageContainer";
import sendGetBuyersRequest from "../../requests/GetBuyersRequest";
import PostModal from "../../components/modal/PostModal";
import sendPatchMultiBuyerRequest from "../../requests/PatchMultiBuyerRequest";
import sendDeleteBuyersRequest from "../../requests/DeleteBuyersRequest";

const BuyerPostPage = () => {
  const { state } = useAuth();
  const [dbData, setDbData] = useState();
  const [data, setData] = useState({ data: [] });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [checked, setChecked] = useState([]);
  const [isPostMode, setIsPostMode] = useState(false);
  const [edited, setEdited] = useState([]);
  const [sortBy, setSortBy] = useState('');

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
  ]
  const resetData = (value) => {
    console.log('reset data: ', value);
    setData(value);
    setDbData(value);
  }
  useEffect(() => {
    sendGetBuyersRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading);
  }, [page, sortBy]);

  return (
    <div>
      <Header></Header>
      <div className='app-container'>
        <Sidebar></Sidebar>
        <div className="app-content-container">
          <div className="app-background">
            <div className='manufacturer-list-container'>
              <div className='manufacturer-tool-container'>
                <select onChange={(e) => setSortBy(e.target.value)}>
                  <option disabled='true'>정렬 기준 선택</option>
                  <option value='buyerCd'>고객사 코드</option>
                  <option value='buyerNm'>고객사 명</option>
                  <option value='createdAt'>등록순</option>
                </select>
                <div />
                <div className='manufacturer-button-container'>
                  <button className='manufacturer-button' onClick={() => setIsPostMode(true)}>추가</button>
                  <button className='manufacturer-button' onClick={() => {
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
                    sendPatchMultiBuyerRequest(state, requestBody, () => {
                      sendGetBuyersRequest(state, page, setPage, sortBy, 10, resetData, setIsLoading);
                      setChecked([]);
                    });
                  }}>수정</button>
                  <button className='manufacturer-button'
                    onClick={() => {
                      console.log('checked: ', checked);
                      const checkedData = checked.map(item => data.data[item].itemId);
                      sendDeleteBuyersRequest(state, data.pageInfo, checkedData, setChecked, () => {
                        sendGetBuyersRequest(state, page, setPage, 10, resetData, setIsLoading);
                        setChecked([]);
                      });
                    }}>삭제</button>
                </div>
              </div>
              {isLoading ? <div /> : <EditableTableWithCheckbox
                columns={columnData}
                ogData={dbData}
                data={data}
                setData={(data) => setData(data)}
                checked={checked}
                setChecked={setChecked}
                edited={edited}
                setEdited={setEdited}
              >
              </EditableTableWithCheckbox>}
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
              columnData={columnData}
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
export default BuyerPostPage;