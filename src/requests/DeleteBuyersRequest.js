import axios from 'axios';

const sendDeleteBuyersRequest = async (state, pageInfo, checkedData, setChecked, executeAfter) => {
    try {
        console.log('checkedItems: ', checkedData);
        /* const selected = checkedItems.map(item => item + (pageInfo.page - 1) * pageInfo.size);
        console.log('selected: ', selected); */
        const response = await axios.delete(`http://localhost:8080/buyers`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.token}`
                },
                data: {
                    buyerId: checkedData
                },
            }
        );

        if (response.status === 204) {
            console.log('고객사 삭제 성공: ', response.data);
            setChecked([]);
            if(executeAfter !== undefined){
                executeAfter();
            }
        } else {
            console.log('고객사 삭제 실패: ', response.status);
            
        }
    } catch (error) {
        console.error('고객사 삭제 실패(에러 발생):', error);
    }
};

export default sendDeleteBuyersRequest;
