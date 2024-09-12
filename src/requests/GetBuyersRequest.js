import axios from 'axios';

const sendGetBuyersRequest = async (state ,page, setPage, size, sortBy, setData, setIsLoading) => {
    /* console.log("state: ", state); */
    console.log('sortBy in request: ', sortBy);
    try {
        const response = await axios.get(`http://localhost:8080/buyers`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                }   
                ,params: {
                    page: page,
                    size: size,
                    sort: sortBy,
                }
            }
        );

        if (response.status === 200) {
            if(response.data.data.length === 0 && page > 1){
                setPage(Math.max(1, page - 1));
                console.log('요소가 없어서 -1 페이지 호출');
                return;
            }
            console.log('고객사 정보 GET요청 성공: ', response.data);
            setData(response.data);
            if(setIsLoading !== undefined){
                setIsLoading(false);
            }
        } else {
            console.log('고객사 정보 GET요청 실패');
        }
    } catch (error) {
        console.error('고객사 정보 GET요청 실패(에러 발생)', error);
    }
};

export default sendGetBuyersRequest;
