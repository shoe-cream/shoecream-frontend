import axios from 'axios';
import Swal from 'sweetalert2';

const sendGetManufacturersRequest = async ({state ,page, setPage, size, sort, mfNm, setData, setIsLoading}) => {
    //console.log("state: ", state);
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/manufacturers`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                }   
                ,params: {
                    page: page,
                    size: size,
                    sort: sort,
                    mfNm: mfNm,
                }
            }
        );

        if (response.status === 200) {
            if(response.data.data.length === 0 && page > 1){
                setPage(Math.max(1, page - 1));
                //console.log('요소가 없어서 -1 페이지 호출');
                return;
            }
            //console.log('제조사 정보 GET요청 성공: ', response.data);
            setData(response.data);
            if(setIsLoading !== undefined){
                setIsLoading(false);
            }
        } else {
            //console.log('제조사 정보 GET요청 실패');
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        //console.error('제조사 정보 GET요청 실패(에러 발생)', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
};

export default sendGetManufacturersRequest;
