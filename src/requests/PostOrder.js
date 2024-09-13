import axios from "axios";
import Swal from "sweetalert2";

const sendPostOrder = async(state, buyerCd, requestDate, orderItemDtoList) => {
    try {
        console.log('buyerId:', buyerCd);
        console.log('requestDate',requestDate);
        console.log('orderItems',orderItemDtoList);

        const orderPostDtos =[{
            buyerCd: buyerCd,
            requestDate: requestDate,
            orderItems: orderItemDtoList
        }];

        const response = await axios.post('http://localhost:8080/orders',
            orderPostDtos,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }
            }
        );
        if (response.status === 200 || response.status === 201) {
            console.log('주문 등록 성공', response);
            alert("등록에 성공했습니다.")
        } else {
            console.log('주문 등록 실패: ', response.status);
            Swal.fire({text: `요청 실패(${response.status})`});
        }
    } catch (error) {
        console.error('주문 등록 실패(에러 발생): ', error);
        Swal.fire({text: `요청 실패(${error.status})`});
    }
};

export default sendPostOrder;
