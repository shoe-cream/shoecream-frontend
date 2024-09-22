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
import sendGetAllItemsRequest from '../../requests/GetAllItemsRequest';
import './itemPostPage.css';
import Swal from 'sweetalert2';
import { Plus, Edit, Trash2 } from 'lucide-react';
import SearchWindow from '../../components/search/SearchWindow';
import ConfirmAlert from '../../components/alert/ConfirmAlert';


const ItemPostPage = () => {
  const { state } = useAuth();
  const [dbItems, setDbItems] = useState();
  const [items, setItems] = useState({ data: [] });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);

  const [checked, setChecked] = useState([]);
  const [isPostMode, setIsPostMode] = useState(false);
  const [edited, setEdited] = useState([]);
  const [sortBy, setSortBy] = useState('itemCd');

  const [allData, setAllData] = useState({ data: [] });
  const [searchCondition, setSearchCondition] = useState('');

  /* console.log('edited: ', edited); */
  console.log('items in page: ', items);


  const resetData = (value) => {
    console.log('reset data: ', value);
    setItems(value);
    setDbItems(value);
  }

  useEffect(() => {
    sendGetItemsRequest({ state: state, page: page, setPage: setPage, size: 10, sort: sortBy, itemNm: searchCondition, setData: resetData, setIsLoading: setIsLoading });
    sendGetAllItemsRequest(state, setAllData, setIsLoading2);
  }, [page, sortBy]);

  const columnData = [
    {
      accessor: 'itemNm',
      Header: '제품명',
    },
    {
      accessor: 'itemCd',
      Header: '제품 코드',
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
    },
    {
      accessor: 'unitPrice',
      Header: '단가',
      type: 'number',
      max: 9999999,
      min: 50,
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
      Header: '제품명',
    },
    {
      accessor: 'category',
      Header: '카테고리',
    },
    {
      accessor: 'color',
      Header: '색상',
      type: 'dropdown',
      options: ['Black', 'White', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown', 'Purple'],
    },
    {
      accessor: 'size',
      Header: '사이즈',
      type: 'number',
    },
    {
      accessor: 'unit',
      Header: '단위',
      type: 'dropdown',
      options: ['개', '켤레'],
    },
    {
      accessor: 'unitPrice',
      Header: '단가',
      type: 'number',
    },
  ]

  return (
    <div className="item-post-page">
      <div>
        <Header></Header>
        <div className='app-container'>
          <Sidebar></Sidebar>
          <div className='app-content-container'>
            <div className='app-background'>
              <h2 className="app-label">제품 관리</h2>
              <div className='manufacturer-list-container'>
                <div className='manufacturer-tool-container'>
                  <select className='custom-select-class'
                    onChange={(e) => setSortBy(e.target.value)}>
                    <option disabled selected>정렬 기준 선택</option>
                    <option value={'itemCd'}>제품코드</option>
                    <option value={'itemNm'}>제품명</option>
                    <option value={'createdAt'}>등록순</option>
                    <option value={'unitPrice'}>단가순</option>
                  </select>
                  <SearchWindow
                    placeholder='제품 이름으로 검색'
                    suggestions={
                      allData.data.map(data => ({
                        key: data.itemNm,
                        onSearch: () => {
                          /* const itemNm = data.itemNm.replace(/\s+/g, ''); */
                          const itemNm = data.itemNm;
                          console.log('data: ', data);
                          console.log('itemNm: ', data.itemNm);
                          sendGetItemsRequest(
                            { state: state, page: page, setPage: setPage, size: 10, sort: sortBy, itemNm: itemNm, setData: resetData, setIsLoading: setIsLoading }
                          );
                        }
                      }))
                    }
                    defaultSearch={() => sendGetItemsRequest(
                      { state: state, page: page, setPage: setPage, size: 10, sort: sortBy, setData: resetData, setIsLoading: setIsLoading }
                    )}
                    setSearchCondition={setSearchCondition}
                  />
                  <div />
                  <div className='manufacturer-button-container'>
                    <button className='manufacturer-button' onClick={() => setIsPostMode(true)}><Plus size={16} /> 추가</button>
                    <button className='manufacturer-button' onClick={() => {
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
                        const index = Number(key);
                        const itemId = items.data[index].itemId;
                        const updatedData = checkedAndEdited[key];
                        requestBody.push({
                          itemId,
                          ...updatedData
                        });
                      });
                      console.log('requestBody: ', requestBody);
                      sendPatchMultiItemRequest(state, requestBody, () => {
                        sendGetItemsRequest({ state: state, page: page, setPage: setPage, size: 10, sort: sortBy, itemNm: searchCondition, setData: resetData, setIsLoading: setIsLoading });
                        setChecked([]);
                      });
                    }}><Edit size={16} /> 수정</button>
                    <button className='manufacturer-button'
                      onClick={() => {
                        if (checked.length === 0) {
                          Swal.fire({ text: "하나 이상의 데이터를 선택해주세요" });
                          return;
                        }
                        ConfirmAlert({
                          dataLength: checked.length,
                          onConfirm: () => {
                            /* console.log('checked: ', checked); */
                            const checkedItems = checked.map(item => items.data[item].itemId);
                            sendDeleteItemRequest(state, items.pageInfo, checkedItems, setChecked, () => {
                              sendGetItemsRequest({ state: state, page: page, setPage: setPage, size: 10, sort: sortBy, itemNm: searchCondition, setData: resetData, setIsLoading: setIsLoading });
                              setChecked([]);
                            });
                          },
                        })
                      }}><Trash2 size={16} /> 삭제</button>
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
              {isLoading || isLoading2 ? <div /> : <PageContainer
                currentPage={page}
                setPage={setPage}
                pageInfo={items.pageInfo}
                getPage={(page) => {
                  sendGetItemsRequest({ state: state, page: page, setPage: setPage, size: 10, sort: sortBy, setData: resetData, setIsLoading: setIsLoading });
                }}
                setChecked={(value) => setChecked(value)}
                setIsLoading={setIsLoading}
              ></PageContainer>}
            </div>
            {isPostMode ? <PostModal
              state={state}
              setOpened={setIsPostMode}
              columnData={postColumnData}
              postRequest={(checkedData, setOpened, setParentData) => {
                sendPostMultiItemRequest(state, checkedData, () => {
                  setChecked([]);
                  setOpened(false);
                  sendGetItemsRequest({ state: state, page: page, setPage: setPage, size: 10, sort: sortBy, setData: (value) => setParentData(value) });
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