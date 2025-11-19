# Claude-to-Grok MCP Server

Claude Desktop에서 Grok AI를 MCP(Model Context Protocol) 서버로 사용하는 Agent-to-Agent 통합 프로젝트

## 🎯 프로젝트 목적

- **Claude**: 메인 AI (일반 코딩, 디버깅, 파일 생성/수정)
- **Grok**: 검색/브레인스토밍 전문 AI (실시간 웹/X 검색, 아이디어 생성, 최신 트렌드)

## ✨ 주요 기능

### `ask_grok` 도구

Grok의 강력한 검색 및 추론 기능을 Claude Desktop에서 직접 사용할 수 있습니다.

**핵심 강점:**

- 🔍 **실시간 웹 검색**: 최신 정보, 기술 트렌드, 뉴스
- 🐦 **X/Twitter 데이터**: 실시간 소셜 트렌드, 개발자 커뮤니티 의견
- 💡 **브레인스토밍**: 창의적 아이디어 생성, 문제 해결 접근법
- 🧠 **대용량 컨텍스트**: 최대 2M 토큰 (Gemini의 2배!)
- ⚡ **빠른 추론**: Grok-4 최신 모델

**모델 선택:**

- `grok-4` (기본): 최고 품질, 복잡한 추론
- `grok-3`: 더 빠른 응답

### `generate_image` 도구

Grok의 이미지 생성 모델(grok-2-image-1212)을 사용하여 고품질 이미지를 생성할 수 있습니다.

**핵심 강점:**

- 🎨 **고품질 이미지 생성**: 텍스트 설명만으로 이미지 생성
- 📐 **다양한 크기 지원**: 1024x1024, 1792x1024, 1024x1792
- ⭐ **품질 옵션**: standard, hd
- 🔢 **배치 생성**: 한 번에 최대 4개 이미지 생성

**파라미터:**

- `prompt` (필수): 이미지 설명
- `size` (선택): 이미지 크기 (기본: 1024x1024)
- `quality` (선택): 이미지 품질 (기본: standard)
- `n` (선택): 생성할 이미지 개수 (기본: 1, 최대: 4)

## 🛠 기술 스택

- **Runtime**: Node.js 18+
- **MCP SDK**: @modelcontextprotocol/sdk
- **AI API**: xAI Grok API (OpenAI 호환)
- **IDE**: Claude Desktop

## 📦 설치 방법

### 1. 사전 준비

- Node.js 18 이상 설치
- xAI API 키 발급 ([console.x.ai](https://console.x.ai))
- Claude Desktop 설치

### 2. 프로젝트 클론

```bash
git clone https://github.com/Yoon-jongho/claude-to-grok.git
cd claude-to-grok
```

### 3. 의존성 설치

```bash
npm install
```

### 4. 환경변수 설정

```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
echo 'export GROK_API_KEY="api key를 입력하세요"' >> ~/.zshrc

# 적용
source ~/.zshrc

# 체크
echo $GROK_API_KEY

# 실행 테스트
node index.js

```

### 5. Claude Desktop 설정

`~/Library/Application Support/Claude/claude_desktop_config.json` 파일 편집:

```json
{
  "mcpServers": {
    "grok": {
      "command": "/Users/YOUR_USERNAME/.nvm/versions/node/v22.14.0/bin/node",
      "args": ["/ABSOLUTE_PATH/claude-to-grok/index.js"],
      "env": {
        "GROK_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 6. Claude code 설정

```bash

claude mcp add claude-to-grok --env GROK_API_KEY=your-api-key-here -- /Users/YOUR_USERNAME/.nvm/versions/node/v22.14.0/bin/node /Users/YOUR_USERNAME/Desktop/프로젝트경로/claude-to-grok/index.js

```

**주의사항:**

- `YOUR_USERNAME`을 실제 사용자명으로 변경 (PC 사용자명)
- `/ABSOLUTE_PATH/`를 실제 프로젝트 경로로 변경
- `your-api-key-here`를 실제 Grok API 키로 변경

### 6. Claude Desktop 재시작

완전 종료 (`Cmd+Q`) 후 다시 실행

## 🚀 사용 방법

### 텍스트 생성 (ask_grok)

#### 기본 사용

```
ask_grok 도구로 "2025년 최신 React 베스트 프랙티스를 알려줘"
```

#### 실시간 검색

```
ask_grok 도구로 "지금 X에서 가장 핫한 AI 개발 트렌드 3가지"
```

#### 코드 최적화

```
ask_grok with context:
[코드 붙여넣기]
"이 코드의 성능을 개선할 수 있는 최신 기법을 제안해줘"
```

#### Grok-3 (빠른 응답)

```
ask_grok 도구로 model을 "grok-3"로 설정하고
"간단한 질문입니다..."
```

### 이미지 생성 (generate_image)

#### 기본 이미지 생성

```
generate_image 도구로 "A futuristic city with flying cars at sunset"
```

#### 고품질 이미지 생성

```
generate_image 도구로
prompt: "A professional headshot of a software developer in a modern office"
quality: "hd"
size: "1024x1024"
```

#### 여러 이미지 한 번에 생성

```
generate_image 도구로
prompt: "A cute robot mascot for a tech startup"
n: 4
size: "1024x1024"
```

#### 와이드 이미지 생성

```
generate_image 도구로
prompt: "A panoramic view of mountains and lakes"
size: "1792x1024"
quality: "hd"
```

## 💡 사용 시나리오

### 시나리오 1: 최신 기술 조사

**상황**: Next.js 14 vs 15 어떤 걸 쓸까?

```
ask_grok: "Next.js 14와 15의 차이점을 실시간 검색으로 조사하고,
현재 개발자 커뮤니티의 의견도 X에서 찾아줘"
```

**Grok의 답변 예시:**

- 최신 Next.js 15 릴리스 노트 검색
- X/Twitter에서 개발자들의 실제 마이그레이션 경험
- Stack Overflow 최신 이슈들
- 추천: 상황별 선택 가이드

---

### 시나리오 2: 라이브러리 선택

**상황**: 상태관리 라이브러리 고민 중

```
ask_grok: "2025년 현재 React 상태관리 라이브러리 인기 순위와
각각의 장단점을 실시간 데이터로 비교해줘.
X에서 개발자들이 실제로 뭘 쓰는지도 알려줘"
```

---

### 시나리오 3: 에러 해결

**상황**: 이상한 에러 발생

```
ask_grok with context:
[에러 메시지]
"이 에러의 최신 해결 방법을 찾아줘.
Stack Overflow와 GitHub Issues 검색해서"
```

---

### 시나리오 4: 브레인스토밍

**상황**: 프로젝트 아이디어 필요

```
ask_grok: "인천공항 키오스크에 추가할 수 있는
혁신적인 기능 10가지를 제안해줘.
최신 공항 기술 트렌드도 참고해서"
```

---

### 시나리오 5: 경쟁사 분석

**상황**: 경쟁사 기술 스택 궁금

```
ask_grok: "Shopify의 최신 기술 스택을 조사하고,
엔지니어 블로그와 X 포스트에서
그들이 어떤 기술을 사용하는지 찾아줘"
```

---

### 시나리오 6: 프로젝트 비주얼 생성

**상황**: 웹사이트 히어로 이미지 필요

```
generate_image: "A modern minimalist landing page hero image
with a laptop showing code, coffee cup, and plants on a wooden desk,
bright natural lighting, professional photography style"
quality: "hd"
size: "1792x1024"
```

---

### 시나리오 7: 프로토타입 아이콘 생성

**상황**: 앱 아이콘 여러 버전 필요

```
generate_image: "A friendly robot mascot for a productivity app,
simple flat design, vibrant blue and orange colors, white background"
n: 4
size: "1024x1024"
```

---

### 시나리오 8: 마케팅 자료 이미지

**상황**: 블로그 포스트 썸네일 생성

```
generate_image: "Abstract visualization of AI and machine learning,
neural network connections, gradient colors from blue to purple,
modern tech aesthetic, suitable for blog thumbnail"
quality: "hd"
size: "1792x1024"
```

## 📚 실전 가이드

**더 자세한 실무 활용법은 [📖 실전 활용 가이드 (USECASES.md)](./USECASES.md)를 참고하세요!**

**주요 내용:**

- 🔍 최신 기술 트렌드 리서치
- 💡 브레인스토밍 및 아이디어 생성
- 🚨 실시간 이슈 해결
- 📊 경쟁사 기술 분석
- 🎨 프로젝트 기획 및 전략 수립
- 💰 비용 최적화 팁

## 🆚 Multi-Agent 시스템에서의 역할

### Claude + Gemini + Grok 3-Agent 구성

```
┌─────────────────────────────────────┐
│  Claude (메인 - 95%)                │
│  - 일반 코딩                        │
│  - 디버깅                           │
│  - 파일 작업                        │
└──────────┬──────────────────────────┘
           │
      ┌────┴────┐
      ▼         ▼
┌──────────┐ ┌──────────┐
│ Gemini   │ │  Grok    │
│(컨텍스트)│ │ (검색)   │
│          │ │          │
│1M 토큰   │ │2M 토큰   │
│대규모    │ │실시간    │
│분석      │ │검색      │
└──────────┘ └──────────┘
```

### 언제 어떤 Agent를 사용하나?

| 작업                 | Agent    | 이유                      |
| -------------------- | -------- | ------------------------- |
| 일반 코딩            | Claude   | 빠르고 정확               |
| 전체 코드베이스 분석 | Gemini   | 1M 토큰 컨텍스트          |
| 최신 트렌드 검색     | **Grok** | 실시간 웹/X 검색          |
| 라이브러리 선택      | **Grok** | 최신 정보 + 커뮤니티 의견 |
| 브레인스토밍         | **Grok** | 창의적 아이디어 생성      |
| 에러 해결            | **Grok** | 최신 Stack Overflow 검색  |
| 코드 최적화 아이디어 | **Grok** | 최신 기법 검색            |

## 📊 모델 비교

### 텍스트 생성 모델

| 항목          | Grok-4                   | Grok-3                 |
| ------------- | ------------------------ | ---------------------- |
| **속도**      | 보통 (2-5초)             | 빠름 (1-3초)           |
| **품질**      | 최고                     | 좋음                   |
| **컨텍스트**  | 2M 토큰                  | 2M 토큰                |
| **비용**      | 약간 비쌈                | 저렴                   |
| **추천 용도** | 복잡한 분석, 중요한 결정 | 빠른 검색, 간단한 질문 |

### 이미지 생성 모델

| 항목          | grok-2-image-1212           |
| ------------- | --------------------------- |
| **모델 타입** | 이미지 생성                 |
| **크기 옵션** | 1024x1024, 1792x1024, 1024x1792 |
| **품질**      | standard, hd                |
| **배치 생성** | 최대 4개                    |
| **추천 용도** | 프로토타입, 마케팅, 디자인  |

### 비용 예시 (2025년 11월 기준)

```
일반 사용 (월 100회):
- 간단한 검색: ~$2
- 복잡한 분석: ~$5
평균: $3-4/월
```

## 🔒 보안 주의사항

### API 키 보호 필수

**절대 금지:**

- ❌ GitHub에 API 키 업로드
- ❌ 코드에 API 키 하드코딩
- ❌ 공개 장소에 키 공유

**권장 사항:**

- ✅ 환경변수로만 관리
- ✅ `.gitignore`에 설정 파일 포함
- ✅ API 키 정기 교체

### .gitignore 필수 내용

```
node_modules/
.env
*.key
.DS_Store
```

## 🤝 기여 방법

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔗 관련 프로젝트

- [claude-to-gemini](https://github.com/Yoon-jongho/claude-to-gemini) - Gemini 통합 (대용량 컨텍스트 분석)

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일 참조

## 🔗 참고 자료

- [MCP 공식 문서](https://modelcontextprotocol.io)
- [xAI Grok API 문서](https://docs.x.ai)
- [Claude Desktop](https://claude.ai/download)

## 📧 문의

프로젝트 관련 문의: [GitHub Issues](https://github.com/Yoon-jongho/claude-to-grok/issues)

---

**Made with ❤️ for Agent-to-Agent Workflows**

**프로젝트 구성:**

- 🤖 Claude (메인) + 🔍 Grok (검색) + 🧠 Gemini (분석) = Perfect Team! 🚀
