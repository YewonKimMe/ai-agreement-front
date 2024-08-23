<script setup>
</script>

<template>
  <div class="min-vh-100 p-2 container-lg font-home">
    <h3>계약서 파일 업로드 프로토타입</h3>
    <p>파일 업로드 시 파일 선택 -> [Ctrl + 클릭] 으로 여러개의 파일을 업로드 할 수 있습니다.<br>jpg, png 만 업로드 가능합니다.</p>
    <form @submit.prevent="">

    </form>
    <div class="input-group mb-3">
      <input type="file" class="form-control" multiple id="inputGroupFile02" @change="handleFileSelection">
    </div>
    <div v-if="selectedFiles.length" class="mb-3">
      <h5>선택된 파일:</h5>
      <ul class="list-group">
        <li v-for="(file, index) in selectedFiles" :key="index" class="list-group-item">
          {{ file.name }}
        </li>
      </ul>
    </div>
    <button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04">전송</button>
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
        selectedFiles: [],
        isLoading: false,
      };
    }, 
    setup() {}, //컴포지션 API
    created() {
    }, //컴포넌트가 생성되면 실행
    mounted() {}, //template에 정의된 html 코드가 렌더링된 후 실행
    unmounted() {}, //unmount가 완료된 후 실행
    methods: {
      handleFileSelection(event) {
        this.selectedFiles = Array.from(event.target.files);
      },
      async uploadFiles() {
      if (this.selectedFiles.length === 0) {
        this.uploadStatus = 'Please select files to upload.';
        return;
      }
      
      const formData = new FormData();
      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      try {
        const response = await axios.post('https://your-server-endpoint/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.uploadStatus = 'Files uploaded successfully!';
        } catch (error) {
          console.error('Error uploading files:', error);
          this.uploadStatus = 'Error uploading files.';
        }
      }
    } //컴포넌트 내에서 사용할 메소드 정의
  }
</script>
<style>
.font-home {
  font-family: 'GowunDodum';
}
</style>