<script setup>
</script>

<template>
  <div class="min-vh-100 p-2 container-lg">
    <h3>계약서 파일 업로드</h3>
    <div class="input-group mb-3">
      <input type="file" class="form-control" id="inputGroupFile02">
      <button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04">전송</button>
    </div>
  </div>
</template>
<script>
import AxiosInstance from '@/axios'
import mixins from '@/mixins';
  export default { 
    name: '', //컴포넌트 이름
    components: {}, //다른 컴포넌트 사용시 컴포넌트를 import 하고, 배열로 저장
    mixins: [mixins],
    data() { //html과 자바스크립트 코드에서 사용할 데이터 변수 선언부
      return {
        data: {},
        isLoading: false,
      };
    }, 
    setup() {}, //컴포지션 API
    created() {
    }, //컴포넌트가 생성되면 실행
    mounted() {}, //template에 정의된 html 코드가 렌더링된 후 실행
    unmounted() {}, //unmount가 완료된 후 실행
    methods: {
      async getPreview(previewNum) {
        try {
          this.isLoading = true;
          const response = await AxiosInstance.get("/api/v1/preview", {params: {num: previewNum}});
          this.previewList = response.data;
        } catch (error) {
          if (error.code == this.networkErrorCode) {
                alert(this.networkErrorMsg);
            } else {
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    alert("오류가 발생했습니다.");
                }
            }
        } finally {
          this.isLoading = false;
        }
      }
    } //컴포넌트 내에서 사용할 메소드 정의
  }
</script>