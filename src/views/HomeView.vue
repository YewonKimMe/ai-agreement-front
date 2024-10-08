<script setup>
import IconX from '@/components/icons/IconX.vue';
import IconImages from '@/components/icons/IconImages.vue';
import IconFileTypeJpg from '@/components/icons/IconFileTypeJpg.vue';
import IconFileTypePng from '@/components/icons/IconFileTypePng.vue';
</script>

<template>
  <div class="min-vh-100 p-2 container-lg font-home">
    <h3>계약서 파일 업로드 프로토타입/구조화 응답 적용</h3>
    <p>파일 업로드 시 파일 선택 -> [Ctrl + 클릭] 으로 여러개의 파일을 업로드 할 수 있습니다.<br>jpg, jpeg, png 만 업로드 가능합니다.</p>
    <div>
      <form @submit.prevent="uploadFiles">
        <div class="input-group mb-3">
          <input type="file" class="form-control" multiple id="upload-file" @change="handleFileSelection" hidden>
          <label for="upload-file">
            <div class="btn btn-success p-2">
              <IconFileTypeJpg /><IconFileTypePng /> <span class="fs-5">계약서 이미지 업로드</span>
            </div>
          </label>
        </div>
        <div v-if="selectedFiles.length" class="mb-3">
          <h5>선택된 파일:</h5>
          <ul class="list-group">
            <li v-for="(file, index) in selectedFiles" :key="index" class="list-group-item">
              {{ file.name }} 
              <button class="btn btn-sm icon-link p-1" type="button" @click="removeFileAt(index)">
                <IconX />
              </button>
            </li>
          </ul>
        </div>
        <button class="btn" type="submit" :class="{'disabled': selectedFiles.length == 0 || isLoading, 'btn-secondary': selectedFiles.length == 0, 'btn-success': selectedFiles.length != 0}">전송</button>
      </form>
    </div>

    <div v-if="isLoading">
      <div class="text-center">
        <div class="spinner-border m-2" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p>계약서를 읽는 중입니다...</p>
      </div>
    </div>

    <div v-if="!isLoading && uploadFail">
      <p class="text-danger text-center">업로드에 실패했습니다.</p>
    </div>
    <hr>
    <div v-if="!isLoading && !uploadFail && responseData">
      <h4>분석 결과:</h4>
      <div>
        <h5>요약</h5>
        <span>점수 총점: {{scores}} => <span :class="{'text-success': totalScore >= 85, 'text-warning': totalScore < 70, 'text-danger': totalScore < 50}">{{totalScore}}</span></span>
        <ul class="list-group">
          <li class="list-group-item">
            <span>1. 기본 정보의 정확성 (20점 만점) / <span :class="{'text-success': scores[0] >= good, 'text-warning' : scores[0] < soso, 'text-danger' : scores[0] < bad}">{{scores[0]}} 점</span></span>
          </li>
          <li class="list-group-item">
            <span>2. 법적 효력 (20점 만점) / <span :class="{'text-success': scores[1] >= good, 'text-warning' : scores[1] < soso, 'text-danger' : scores[1] < bad}">{{scores[1]}} 점</span></span>
          </li>
          <li class="list-group-item">
            <span>3. 특약 사항의 완성도 (20점 만점) / <span :class="{'text-success': scores[2] >= good, 'text-warning' : scores[2] < soso, 'text-danger' : scores[2] < bad}">{{scores[2]}} 점</span></span>
          </li>
          <li class="list-group-item">
            <span>4. 양측 권리와 의무의 명확성 (20점 만점) / <span :class="{'text-success': scores[3] >= good, 'text-warning' : scores[3] < soso, 'text-danger' : scores[3] < bad}">{{scores[3]}} 점</span></span>
          </li>
          <li class="list-group-item">
            <span>5. 기타 중요한 조항 (20점 만점) / <span :class="{'text-success': scores[4] >= 17, 'text-warning' : scores[4] < soso, 'text-danger' : scores[4] < bad}">{{scores[4]}} 점</span></span>
          </li>
        </ul>
      </div>
      <div>
        <hr>
        <h4>계약서>> {{responseData.data.contractName}}</h4>
        <h4>임대인>> {{responseData.data.landlord}}</h4>
        <div>
          <p v-for="(message, idx) in responseMessages" :key="idx">
            {{ message }}
          </p>
        </div>
      </div>
      <hr>
      <div>
        <h4>응답 데이터</h4>
        <pre>{{formattedData(responseData)}}</pre>
      </div>
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
        selectedFiles: [],
        isLoading: false,
        responseData: null,
        uploadFail: false,
        responseMessages: [],
        scores: [],
        good: 17,
        soso: 15, 
        bad: 13,
        totalScore: 0,
      };
    }, 
    setup() {}, //컴포지션 API
    created() {
      this.checkAuth();
    }, //컴포넌트가 생성되면 실행
    mounted() {}, //template에 정의된 html 코드가 렌더링된 후 실행
    unmounted() {}, //unmount가 완료된 후 실행
    methods: {
      handleFileSelection(event) {
        this.selectedFiles = Array.from(event.target.files);
      },
      async uploadFiles() {
        if (this.selectedFiles.length === 0) {
          return;
        }
      
        const formData = new FormData();
        this.selectedFiles.forEach(file => {
          formData.append('images', file);
        });

        this.isLoading = true; 
        this.uploadFail = false;
        try {
          const response = await AxiosInstance.post('/api/v1/chat/agreement-images', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': this.getCookie(this.authCookie),
            },
            params: {
              isStructured: 1,
            }
          });
          this.responseData = response.data;
          console.log("response.data", response.data.data);
          this.responseMessages = response.data.data.evaluationContentsByStandard;
          //this.scores = this.getScoreList(response.data.data, 1).slice(1, -1).split(";").map(Number);
          this.scores = response.data.data.evaluationScoresByStandard;
          this.totalScore = response.data.data.evaluationScoresByStandard.reduce((sum, current) => sum + current, 0);
          
        } catch (error) {
          console.error('Error uploading files:', error);
          this.uploadFail = true;
          alert(error.response.data);
        } finally {
          this.isLoading = false;
          console.log("uploadFail: " + this.uploadFail);
        }
      },
      removeFileAt(index) {
        this.selectedFiles.splice(index, 1);
      },
      async checkAuth() {
        const serviceKey = this.getCookie(this.authCookie);
          if(!serviceKey || serviceKey.length == 0) {
            try {
              const response = await AxiosInstance.get("/api/v1/connection");
              this.setTimeCookie(this.authCookie, response.headers.get(this.authHeader), 2);
            } catch (error) {
              if (error.response) {
                alert(error.response.data.message);
              } else {
                  alert("오류가 발생했습니다.");
              }
            }
          }
      },
      formattedData(data) {
        return JSON.stringify(data, null, 2);
      }
    } //컴포넌트 내에서 사용할 메소드 정의
  }
</script>
<style>
.font-home {
  font-family: 'GowunDodum';
}
pre {
  white-space: pre-wrap;  /* 줄 바꿈을 유지하고, 긴 줄을 화면에 맞추기 */
  background: #000000;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>