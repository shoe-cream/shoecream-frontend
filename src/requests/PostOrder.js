import axios from "axios";

const sendPostOrder = async(state, buyerCd, requestDate, orderItemDtoList) => {
    try {
        console.log('buyerId:', buyerCd);
        console.log('requestDate',requestDate);
        console.log('orderItems',orderItemDtoList);
        const response = await axios.post('http://localhost:8080/orders',
            {
                "buyerCD": buyerCd,
                "requestDate": requestDate,
                "orderItems": orderItemDtoList
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': state.token
                }
            }
        );
        if (response.status === 200 || response.status === 201) {
            console.log('주문 등록 성공', response);
        } else {
            console.log('주문 등록 실패: ', response.status);
        }
    } catch (error) {
        console.error('주문 등록 실패(에러 발생): ', error);
    }
};

export default sendPostOrder;
