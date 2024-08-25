export default {
    methods: {
        getCookie(name) {      
            var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');      
            return value? value[2] : null;  
        },
        setTimeCookie(name, value, exp) {
            var date = new Date();
            date.setTime(date.getTime() + exp * 60 * 60 * 1000);
            document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
        },
        deleteCookie(name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
        },
        isMobile() {
            return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        },
        checkAdminAuth() {
            const auth = this.getCookie('_au_3033');
            if (auth != null) {
                try {
                    const payload = JSON.parse(atob(auth.split('.')[1]));
                    if (payload.authorities && payload.authorities.includes('ROLE_ADMIN')) {
                        return true;
                    }
                } catch (error) {
                    console.error("Error occurred while decoding authentication authority:", error);
                }
    }
            return false;
        },
        base64ToUUIDString(base64String) {
            // Base64 문자열을 디코딩하여 바이트 배열로 변환
            const binaryString = atob(base64String);
            const byteArray = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
                byteArray[i] = binaryString.charCodeAt(i);
            }

            // 바이트 배열을 UUID 문자열로 변환
            const byteToHex = (byte) => byte.toString(16).padStart(2, '0');
            const uuidString = [
                byteToHex(byteArray[0]), byteToHex(byteArray[1]), byteToHex(byteArray[2]), byteToHex(byteArray[3]),
                '-',
                byteToHex(byteArray[4]), byteToHex(byteArray[5]),
                '-',
                byteToHex(byteArray[6]), byteToHex(byteArray[7]),
                '-',
                byteToHex(byteArray[8]), byteToHex(byteArray[9]),
                '-',
                byteToHex(byteArray[10]), byteToHex(byteArray[11]), byteToHex(byteArray[12]), byteToHex(byteArray[13]), byteToHex(byteArray[14]), byteToHex(byteArray[15])
            ].join('');

            return uuidString;
        },
        formatNewLine(strings) {
            if (!strings) {
                return "";
            }
            return strings.replaceAll('\n', '<br>');
        },
        formatMarkdownToHtml(reservedstrings) {
            return reservedstrings
            .replace(/@([^#]+)@/g, (match, p1) => {
                return `<blockquote class="blockquote mb-0 p-0">"${p1}"</blockquote>`;
            })
            .replace(/#장점/g, '<span class="fs-6 text-primary fw-bold">장점</span>')
            .replace(/#단점/g, '<span class="fs-6 text-danger fw-bold">단점</span>');
        },
        truncateText(text) {
            const maxLength = 10;
            if (text.length >= maxLength) {
              return text + ' ...'; // 문자열 자르기 및 '...' 추가
            } else {
              return text;
            }
        },
        getDataListString(string) {
            if (!string) {
                return ""
            }
            return string.split('@')[1];
        },
        getScoreList(string, idx) {
            if (!string || !string.includes('@')) {
                return string;
            }
            return string.split('@')[idx]
        }
    },
    data() {
        return {
            backendHost: "http://localhost:8080/api/v1",
            authCookie: '_au_3033',
            networkErrorMsg: '서버가 응답하지 않습니다.',
            networkErrorCode: 'ERR_NETWORK',
            http: 'http://',
            https: 'https://',
            initialConnectionCookieName: '_target_status_connection',
            serviceMaintainCookieName: '_service_maintain_operation_value',
        };
    }
}