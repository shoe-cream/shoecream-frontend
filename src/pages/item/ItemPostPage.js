import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import sendGetItemsRequest from '../../requests/GetItemsRequest';
import PageContainer from '../../components/page_container/PageContainer';
import sendDeleteItemRequest from '../../requests/DeleteItemRequest';
import PostModal from '../../components/modal/PostModal';
import EditableTableWithCheckbox from '../../components/Table/EditableTableWithCheckbox';
import sendPostMultiItemRequest from '../../requests/PostMultiItemRequest';
import sendPatchMultiItemRequest from '../../requests/PatchMultiItemsRequest';
import './itemPostPage.css';
import Swal from 'sweetalert2';


const ItemPostPage = () => {
  const { state } = useAuth();
  const [dbItems, setDbItems] = useState();
  const [items, setItems] = useState({ data: [] });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [checked, setChecked] = useState([]);
  const [isPostMode, setIsPostMode] = useState(false);
  const [edited, setEdited] = useState([]);
  const [sortBy, setSortBy] = useState('itemId');

  /* console.log('edited: ', edited); */
  console.log('items in page: ', items);


  const resetData = (value) => {
    console.log('reset data: ', value);
    setItems(value);
    setDbItems(value);
  }

  useEffect(() => {
    sendGetItemsRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading);
  }, [page, sortBy]);

  const columnData = [
    {
      accessor: 'itemNm',
      Header: '상품명',
      type: 'text',
    },
    {
      accessor: 'itemCd',
      Header: '상품 코드',
    },
    {
      accessor: 'category',
      Header: '카테고리',
    },
    {
      accessor: 'color',
      Header: '색상',
    },
    {
      accessor: 'size',
      Header: '사이즈',
    },
    {
      accessor: 'unit',
      Header: '단위',
      type: 'text',
    },
    {
      accessor: 'unitPrice',
      Header: '단가',
      type: 'number',
    },
    {
      accessor: 'prepareOrder',
      Header: '주문대기량',
    },
    {
      accessor: 'unusedStock',
      Header: '불용재고량',
    },
    {
      accessor: 'totalStock',
      Header: '총 재고량',
    },
  ]
  const postColumnData = [
    {
      accessor: 'itemNm',
      Header: '상품명',
      type: 'text',
    },
    {
      accessor: 'itemCd',
      Header: '상품 코드',
    },
    {
      accessor: 'category',
      Header: '카테고리',
    },
    {
      accessor: 'color',
      Header: '색상',
    },
    {
      accessor: 'size',
      Header: '사이즈',
      type: 'number',
    },
    {
      accessor: 'unit',
      Header: '단위',
      type: 'text',
    },
    {
      accessor: 'unitPrice',
      Header: '단가',
      type: 'number',
    },
  ]

  return (
    <div>
      <Header></Header>
      <div className='app-container'>
        <Sidebar></Sidebar>
        <div className='app-content-container'>
          <div className='app-background'>
            <h2 className="app-label">제품 관리</h2>
            <div className='manufacturer-list-container'>
              <div className='manufacturer-tool-container'>
                <select onChange={(e) => setSortBy(e.target.value)}>
                  <option disabled='true'>정렬 기준 선택</option>
                  <option value={'itemCd'}>제품코드</option>
                  <option value={'itemNm'}>제품명</option>
                  <option value={'createdAt'}>등록순</option>
                  <option value={'unitPrice'}>단가순</option>
                </select>
                <div />
                <div className='manufacturer-button-container'>
                  <button className='manufacturer-button' onClick={() => setIsPostMode(true)}>추가</button>
                  <button className='manufacturer-button' onClick={() => {
                    if(checked.length === 0){
                      Swal.fire({text: "하나 이상의 데이터를 선택해주세요"});
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
                      const itemId = items.data[index].itemId; // data.data 배열에서 해당 인덱스의 원래 데이터를 가져옴
                      const updatedData = checkedAndEdited[key]; // 수정된 데이터를 가져옴

                      // 원래 데이터에 수정된 데이터를 덮어씌움 (업데이트된 필드만 반영)
                      requestBody.push({
                        itemId,
                        ...updatedData
                      });
                    });
                    console.log('requestBody: ', requestBody);
                    sendPatchMultiItemRequest(state, requestBody, () => {
                      sendGetItemsRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading);
                      setChecked([]);
                    });
                  }}>수정</button>
                  <button className='manufacturer-button'
                    onClick={() => {
                      if(checked.length === 0){
                        Swal.fire({text: "하나 이상의 데이터를 선택해주세요"});
                        return;
                      }
                      /* console.log('checked: ', checked); */
                      const checkedItems = checked.map(item => items.data[item].itemId);
                      console.log('checkedItems: ', checkedItems);
                      sendDeleteItemRequest(state, items.pageInfo, checkedItems, setChecked, () => {
                        sendGetItemsRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading);
                        setChecked([]);
                      });
                    }}>삭제</button>
                </div>
              </div>
              <EditableTableWithCheckbox
                columns={columnData}
                ogData={dbItems}
                data={items}
                setData={(data) => setItems(data)}
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
              pageInfo={items.pageInfo}
              getPage={(page) => {
                sendGetItemsRequest(state, page, setPage, 10, sortBy, resetData, setIsLoading);
              }}
              setChecked={(value) => setChecked(value)}
              setIsLoading={setIsLoading}
            ></PageContainer>}
            {isPostMode ? <PostModal
              state={state}
              setOpened={setIsPostMode}
              columnData={postColumnData}
              postRequest={(checkedData, setOpened, setParentData) => {
                sendPostMultiItemRequest(state, checkedData, () => {
                  setChecked([]);
                  setOpened(false);
                  sendGetItemsRequest(state, page, setPage, 10, sortBy, (value) => setParentData(value));
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
export default ItemPostPage;