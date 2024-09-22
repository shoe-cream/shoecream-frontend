import '../../App.css';
import Swal from 'sweetalert2';

const ConfirmAlert = ({ dataLength, onConfirm, onCancel }) => {
    Swal.fire({
        title: `${dataLength}개의 데이터를 삭제하시겠습니까?`,
        text: '이 요청은 취소할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true, // 취소 버튼 추가
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        customClass: {
          title: 'no-wrap-title'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // 확인 버튼을 눌렀을 때 실행할 코드
          onConfirm();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // 취소 버튼을 눌렀을 때 실행할 코드
          if(onCancel !== undefined){
              onCancel();
          }
        }
      })
}
export default ConfirmAlert;