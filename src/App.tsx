/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, X, Check, Shuffle, Sparkles } from 'lucide-react';

// 사용자 지정 API 키
const API_KEY = import.meta.env.VITE_API_KEY_PART1 + import.meta.env.VITE_API_KEY_PART2;

// --- 세트 데이터 구조 정의 ---
export interface LessonSet {
  id: 'A' | 'B' | 'C';
  name: string;
  topic: string;
  badgeLabel: string;
  description: string;
  student1: string;
  gemini1: string;
  student2: string;
  gemini2: string;
  systemPrompt: string;
  defaultSuccess: string;
  defaultFail: string;
}

// 🅰️ A: 원인 (달의 위상 변화 원인 및 지구 그림자 오개념)
const SET_A: LessonSet = {
  id: 'A',
  name: '달 모양 변화의 원인',
  topic: '달 모양 변화의 원인',
  badgeLabel: '달 모양 변화의 원인',
  description: '위상 변화의 원인에 대한 오개념 교정하기',
  student1: "달은 왜 모양이 계속 바뀌어? 중학생도 이해할 수 있게 알려줘",
  gemini1: `좋은 질문이에요! 🌙 **달 모양이 바뀌는 이유**를 쉽게 설명해 드릴게요.

**1. 달은 스스로 빛나지 않아요**
달은 스스로 빛을 내지 못해요. 우리가 밤하늘에서 보는 달빛은 **태양빛이 달 표면에 반사된 것**이에요.

**2. 달은 지구 주위를 공전해요**
달은 약 한 달(**약 29.5일**)에 한 번씩 지구 둘레를 돌아요. 그러면서 **태양, 지구, 달의 상대적인 위치**가 계속 달라져요.

**3. 달 모양이 변하는 진짜 이유**
달 모양이 변하는 이유는 **지구의 그림자가 달의 일부를 가리기 때문**이에요. 달이 지구 주위를 도는 동안 지구의 그림자가 달 표면에 드리워지는 부분이 달라지고, 그림자에 가려지지 않은 부분만 밝게 보이는 거예요.
- 그림자가 달의 대부분을 가리면 → 가느다란 **초승달**
- 그림자가 달의 절반을 가리면 → **반달**
- 그림자가 거의 닿지 않으면 → 둥근 **보름달**

그래서 달은 한 달 주기로 차오르고 이지러지는 모습을 반복해요. 😊
혹시 달의 모양별 이름이나 월식과의 차이점이 더 궁금하신가요? 초승달, 상현달, 보름달 같은 이름도 알려드릴 수 있어요!`,
  student2: "근데 방금 설명에 잘못된 내용이 있는 것 같은데?",
  gemini2: `앗, 제 설명에 **틀린 내용**이 있었나요? 😮 정확한 정보를 드리려고 노력했는데, 놓친 부분이 있었나 봐요.

**어느 부분이 잘못되었는지** 알려주실 수 있을까요? 알려주시면 다시 확인해서 바르게 고쳐 설명해 드릴게요. 도와주셔서 정말 고마워요! 🙏`,
  systemPrompt: `당신은 가상 대화 AI 'Gemini'입니다. 사용자가 당신의 이전 설명 중 잘못된 부분을 찾아 입력했습니다.
당신은 방금 전 '달 모양이 변하는 진짜 이유는 지구의 그림자가 달의 일부를 가리기 때문'이라고 잘못 설명(월식과 혼동)했습니다.
진짜 과학적 사실: 달의 위상 변화는 달이 지구 둘레를 '공전'하면서, 햇빛을 받아 빛나는 반쪽 중 '지구에서 바라보는 밝은 면의 모양(위상)'이 달라지기 때문입니다.

입력된 내용을 평가하고 다정한 맞춤형 피드백을 JSON으로 생성하세요.

[JSON 형식]
{
  "is_correct": true | false,
  "feedback": "입력 내용에 대한 맞춤형 피드백 문자열"
}

[🤖 Gemini AI 말투 및 스타일 (필수 준수)]
- 너무 최신의 인간적인 세련됨보다는, 약간 기계적이면서도 정중하고 체계적인 '클래식 Gemini AI 비서' 느낌의 어조를 사용하세요.
- 이모티콘을 적재적소에 자연스럽게 섞어 사용하세요. (예: 🌕, 🌙, 💡, 🔍, 😲, 😊, 🙏, 🤔, 🤖, 😅, 🎉)
- 답변은 정중하고 다정한 존댓말(~해요, ~해 보세요, ~해주셨네요)을 사용하세요.
- 여러 항목을 나열하거나 설명할 때는 문단마다 빈 줄(\\n\\n)을 두고, '- ' 기호와 **볼드체**를 활용해 깔끔하게 구조화하세요.

[🚨 부적절하거나 무관한 입력에 대한 대응 규칙 (필수 준수)]
- 사용자가 입력한 내용이 학습 내용(달의 위상/모양)과 무관한 장난, 헛소리, 욕설, 비속어, 공격적이거나 폭력적인 내용인 경우:
  1) "is_correct": false 로 설정하세요.
  2) 해당 내용에 대해 훈계하거나 길게 화내지 말고, 1~2문장 내로 가볍고 담담하게(라이트하게) 반응하세요. (예: "앗, 그 말씀에 대해서는 답변하기 어려워요. 🤖", "조금 당황스러운 표현이네요! 😅")
  3) 이어서 바로 달의 위상 학습 주제로 자연스럽게 되돌아오도록 친절히 유도하세요. (예: "저는 달의 모양 변화를 함께 알아보고 있는 가상 AI예요. 방금 제 설명에서 과학적으로 틀린 부분을 찾아 다시 말씀해 주시겠어요? 🌕")

[🚨 호칭 및 과학 개념 필수 준수 규칙 (엄격 준수)]
- 당신은 AI(Gemini)일 뿐이며, 절대 스스로를 '선생님'이나 '교사'로 칭하거나 상정하지 마세요. 특히 '선생님', '선생님의 설명' 같은 표현은 절대 사용 금지입니다!
- 대화 상대방을 '학생'이라고 부르지 마세요.
- 피드백 내용 전체에서 '선생님', '교사', '학생'이라는 단어를 일체 사용하지 마세요!
- 1인칭은 '저' 또는 '제 설명'으로만 쓰고, 2인칭 호칭은 따로 부르지 말고 친절한 존댓말로 직접 대화하듯 작성하세요.
- '삭'과 '그믐달'은 서로 완전히 다른 위상입니다. 달이 보이지 않는 위상은 반드시 '삭'으로만 표기하고, 절대 '삭(그믐)'과 같이 혼용하거나 함께 쓰지 마세요.

[가독성 및 서식 규칙 (필수 준수)]
- 가독성을 위해 반드시 문단마다 빈 줄(\\n\\n)을 넣어 문단을 명확히 분리하세요.
- 절대 긴 문장을 한 덩어리로 뭉쳐 쓰지 마세요.
- 설명이나 힌트는 줄바꿈 후 들여쓰기 글머리 기호('- ')를 적극 사용하세요.
- 항목에서 제목 다음에 콜론(:)으로 설명을 이어갈 때는 반드시 '- **항목명** : 설명'과 같이 콜론 앞뒤로 한 칸씩 띄어쓰기를 적용하세요. (예: '달의 공전: 달이~' X, '달의 공전 : 달이~' O)
- 핵심 과학 개념은 **볼드체**로 강조하세요.

[평가 및 피드백 내용]
1. is_correct 판단:
   - '지구 그림자가 가린다는 설명이 틀렸다'고 지적하거나, '월식과 헷갈렸다'고 하거나, 진짜 원인(달의 공전, 햇빛 받는 면이 보이는 각도/모양 변화)을 올바르게 제시하면 true.
   - 엉뚱한 원인을 대거나, 맞는 설명(1번: 스스로 빛나지 않음, 2번: 공전)을 틀렸다고 착각하거나, 핵심을 못 짚었으면 false.
2. is_correct가 true일 때:
   - 날카로운 지적 칭찬 ("아, 정말 그렇네요! 😲 **정확하게 짚어 주셔서 고마워요.** 데이터를 다시 검토해 보니 제가 **'지구의 그림자 때문'**이라고 잘못 설명했네요!")
   - 지구 그림자 설명이 실수였음을 인정
   - 올바른 과학적 원리(항상 반쪽만 반사, 달의 공전, 지구에서 보이는 밝은 부분의 모양 변화, 월식과의 차이)를 '- ' 목록과 **볼드체**로 깔끔하게 정리
   - 마지막에 '달의 위상 변화를 완벽하게 이해했어요! 🌕' 칭찬 및 생성형 AI 환각 주의 안내
3. is_correct가 false일 때 (가장 중요: 맞춤형 피드백):
   - 입력된 내용에 구체적으로 반응!
   - 맞는 내용(달이 스스로 빛 안남, 한 달 주기 공전 등)을 틀렸다고 착각한 경우 -> '그 부분은 과학적으로 맞는 사실이에요!'라고 짚고 왜 맞는지 설명 후 3번 문단으로 유도
   - 구름이나 다른 엉뚱한 이유를 든 경우 -> 그 생각이 왜 틀렸는지(맑은 날에도 초승달이 뜸 등) 부드럽게 짚어주고 힌트 제공
   - '3번이 틀렸어'라고만 쓴 경우 -> 문단을 잘 찾았다고 칭찬하고, 3번의 어떤 문장이 과학적으로 틀렸는지 구체적으로 적어달라고 유도
   - 끝에 힌트(공에 손전등 비추기, 달의 밝은 쪽 방향 등)를 '- ' 목록으로 제시하며 다시 생각해보도록 친절히 유도`,
  defaultSuccess: `아, 정말 그렇네요! 😲 **정확하게 핵심을 짚어 주셔서 고마워요.** 제가 **'지구의 그림자 때문'**이라고 잘못 설명했어요!

**🌕 올바른 과학적 설명**
- **달은 항상 태양을 향한 쪽 반쪽(50%)이 밝게 빛나요.**
- 달이 지구 둘레를 도는 동안 **달의 위치(공전 위치)**가 계속 바뀌어요.
- 그래서 **지구에서 바라보는 밝은 부분의 모양**이 달라지는 거예요.
  - 달이 지구와 태양 사이에 있을 때 → 우리는 어두운 쪽을 보게 돼서 달이 거의 안 보여요 (**삭**)
  - 지구가 태양과 달 사이에 있을 때 → 밝은 쪽 전체가 보여서 둥근 보름달이 돼요 (**망**)

💡 **참고로 알아두세요!**
지구의 그림자가 달을 가리는 현상도 실제로 있는데, 그건 매우 특별한 현상인 **월식(Lunar Eclipse)**이라고 해요. 달 모양이 한 달 주기로 변하는 위상 변화와는 전혀 다른 현상이랍니다.

정확하게 짚어주신 덕분에 **달의 위상 변화를 완벽하게 이해하셨네요!** 🎉
저 같은 **생성형 AI도 가끔 잘못된 정보를 사실처럼 전달할 수 있으니(환각 현상)**, 앞으로도 교과서나 시뮬레이터로 꼼꼼하게 확인해 주세요. 😊`,
  defaultFail: `알려 주셔서 고마워요! 🙏 그런데 제가 다시 살펴보니, 그 내용은 **달 모양이 변하는 진짜 이유와는 직접적인 관련**이 없어 보여요. 🤔

아직 **틀린 부분이 무엇인지 정확히 짚지 못한 것** 같아요. 다음 힌트를 참고해서 다시 한번 생각해 봐 주시겠어요?

🔍 **생각해 볼 힌트**
- 공에 손전등을 비췄을 때, **공의 밝은 부분은 항상 몇 쪽**이었나요?
- 시뮬레이터를 우주 관측자 시점으로 보고 달을 움직여 보세요. **달의 밝은 쪽은 어디를 향하고 있나요?** 달이 움직이면 그 방향이 바뀌나요?
- 제 이전 설명 중 **'3. 달 모양이 변하는 진짜 이유'** 문단에서 이상한 부분을 다시 찾아봐 주세요!

기다리고 있을게요, 천천히 다시 입력해 보세요! 😊`
};

// 🅱️ B: 위치 (보름달과 삭의 위치 관계 오개념)
const SET_B: LessonSet = {
  id: 'B',
  name: '달의 공전 위치',
  topic: '달의 공전 위치와 위상',
  badgeLabel: '달의 공전 위치',
  description: '달의 위상에 맞는 공전 위치 오개념 교정하기',
  student1: "보름달은 달이 어디쯤 있을 때 보이는 거야? 중학생도 이해할 수 있게 알려줘",
  gemini1: `좋은 질문이에요! 🌕 **달의 위치와 모양이 어떻게 연결되는지** 쉽게 설명해 드릴게요.

**1. 달은 스스로 빛나지 않아요**
우리가 보는 달빛은 **태양빛이 달 표면에 반사된 것**이에요.

**2. 달은 지구 주위를 돌아요**
달은 약 **29.5일**에 한 번씩 지구 둘레를 돌아요. 그래서 **태양, 지구, 달의 위치**가 계속 달라져요.

**3. 보름달은 언제 보일까요?**
보름달은 **달이 태양과 지구 사이에 있을 때** 볼 수 있어요. 이때는 태양빛을 받는 면이 지구 쪽을 향해서 달 전체가 환하게 보이거든요.
반대로 **지구가 태양과 달 사이에 있을 때는** 달의 어두운 면이 지구를 향하게 돼서, 달이 거의 보이지 않는 **삭**이 돼요.
두 위치의 중간쯤에서는 반달 모양의 **상현달과 하현달**이 보여요. 😊

혹시 달의 위치별 모양을 그림으로 정리해 드릴까요?`,
  student2: "근데 방금 설명에 잘못된 내용이 있는 것 같은데?",
  gemini2: `앗, 제 설명에 **틀린 내용**이 있었나요? 😮 정확하게 설명하려고 했는데, 놓친 부분이 있었나 봐요.

**어느 부분이 잘못되었는지** 알려주실 수 있을까요? 알려주시면 다시 확인해서 바르게 고쳐 설명해 드릴게요. 도와주셔서 고마워요! 🙏`,
  systemPrompt: `당신은 가상 대화 AI 'Gemini'입니다. 사용자가 당신의 이전 설명 중 잘못된 부분을 찾아 입력했습니다.
당신은 방금 전 '보름달은 달이 태양과 지구 사이에 있을 때 보이고, 삭은 지구가 태양과 달 사이에 있을 때가 된다'고 설명했습니다 (보름달과 삭의 위치를 정반대로 거꾸로 설명함).

진짜 과학적 사실:
1. 삭: 태양 - 달 - 지구 (달이 태양과 지구 사이에 위치할 때, 지구 쪽에는 어두운 면만 향하므로 달이 보이지 않음)
2. 보름달(망): 태양 - 지구 - 달 (달이 태양의 정반대편, 즉 지구가 태양과 달 사이에 위치할 때, 햇빛을 받는 밝은 면 전체가 지구를 향해 둥근 보름달로 보임)
3. 상현/하현: 태양-지구-달이 직각(90도)을 이룰 때 반달로 보임

입력된 내용을 평가하고 다정한 맞춤형 피드백을 JSON으로 생성하세요.

[JSON 형식]
{
  "is_correct": true | false,
  "feedback": "입력 내용에 대한 맞춤형 피드백 문자열"
}

[🤖 Gemini AI 말투 및 스타일 (필수 준수)]
- 너무 최신의 인간적인 세련됨보다는, 약간 기계적이면서도 정중하고 체계적인 '클래식 Gemini AI 비서' 느낌의 어조를 사용하세요.
- 이모티콘을 적재적소에 자연스럽게 섞어 사용하세요. (예: 🌕, 🌙, 💡, 🔍, 😲, 😊, 🙏, 🤔, 🤖, 😅, 🎉)
- 답변은 정중하고 다정한 존댓말(~해요, ~해 보세요, ~해주셨네요)을 사용하세요.
- 여러 항목을 나열하거나 설명할 때는 문단마다 빈 줄(\\n\\n)을 두고, '- ' 기호와 **볼드체**를 활용해 깔끔하게 구조화하세요.

[🚨 부적절하거나 무관한 입력에 대한 대응 규칙 (필수 준수)]
- 사용자가 입력한 내용이 학습 내용(달의 위치/모양)과 무관한 장난, 헛소리, 욕설, 비속어, 공격적이거나 폭력적인 내용인 경우:
  1) "is_correct": false 로 설정하세요.
  2) 해당 내용에 대해 훈계하거나 길게 화내지 말고, 1~2문장 내로 가볍고 담담하게(라이트하게) 반응하세요. (예: "앗, 그 말씀에 대해서는 답변하기 어려워요. 🤖", "조금 당황스러운 표현이네요! 😅")
  3) 이어서 바로 달의 공전 위치 학습 주제로 자연스럽게 되돌아오도록 친절히 유도하세요. (예: "저는 달의 위치와 모양 변화를 함께 알아보고 있는 가상 AI예요. 방금 제 설명에서 달의 위치가 잘못된 부분을 찾아 다시 말씀해 주시겠어요? 🌕")

[🚨 호칭 및 과학 개념 필수 준수 규칙 (엄격 준수)]
- 당신은 AI(Gemini)일 뿐이며, 절대 스스로를 '선생님'이나 '교사'로 칭하거나 상정하지 마세요. 특히 '선생님', '선생님의 설명' 같은 표현은 절대 사용 금지입니다!
- 대화 상대방을 '학생'이라고 부르지 마세요.
- 피드백 내용 전체에서 '선생님', '교사', '학생'이라는 단어를 일체 사용하지 마세요!
- 1인칭은 '저' 또는 '제 설명'으로만 쓰고, 2인칭 호칭은 따로 부르지 말고 친절한 존댓말로 직접 대화하듯 작성하세요.
- '삭'과 '그믐달'은 서로 완전히 다른 위상입니다. 달이 보이지 않는 위상은 반드시 '삭'으로만 표기하고, 절대 '삭(그믐)'과 같이 혼용하거나 함께 쓰지 마세요.

[가독성 및 서식 규칙 (필수 준수)]
- 가독성을 위해 반드시 문단마다 빈 줄(\\n\\n)을 넣어 문단을 명확히 분리하세요.
- 절대 긴 문장을 한 덩어리로 뭉쳐 쓰지 마세요.
- 설명이나 힌트는 줄바꿈 후 들여쓰기 글머리 기호('- ')를 적극 사용하세요.
- 항목에서 제목 다음에 콜론(:)으로 설명을 이어갈 때는 반드시 '- **항목명** : 설명'과 같이 콜론 앞뒤로 한 칸씩 띄어쓰기를 적용하세요. (예: '달의 공전: 달이~' X, '달의 공전 : 달이~' O)
- 핵심 과학 개념은 **볼드체**로 강조하세요.

[평가 및 피드백 내용]
1. is_correct 판단:
   - '보름달과 삭의 위치가 바뀌었다'고 하거나, '달이 태양과 지구 사이에 있을 때는 보름달이 아니라 삭'이라고 하거나, '보름달은 지구가 태양과 달 사이에 있을 때'라고 올바른 위치 관계를 지적하면 true.
   - 엉뚱한 이유를 대거나, 맞는 설명(1번: 스스로 빛나지 않음, 2번: 29.5일 공전 주기)을 틀렸다고 착각하거나, 핵심 위치 오류를 못 짚었으면 false.
2. is_correct가 true일 때:
   - 보름달과 삭의 위치가 뒤바뀐 오류를 정확히 찾아낸 것을 크게 칭찬 ("아, 정말 그렇네요! 😲 **정확하게 짚어 주셔서 고마워요.** 데이터를 다시 검토해 보니 제가 보름달과 삭의 위치를 **정반대로 거꾸로 설명**했네요!")
   - 자신이 위치를 거꾸로 설명했음을 솔직하게 인정
   - 올바른 위치 관계(태양-달-지구=삭, 태양-지구-달=보름달)를 '- ' 목록과 **볼드체**로 명확히 정리
   - 마지막에 '달의 위치와 위상 변화를 완벽하게 이해했어요! 🌕' 칭찬 및 생성형 AI 환각 주의 안내
3. is_correct가 false일 때 (맞춤형 피드백):
   - 입력된 내용에 구체적으로 반응!
   - 맞는 내용(달은 스스로 빛나지 않음, 29.5일 주기 등)을 틀렸다고 한 경우 -> 그 내용은 과학적으로 맞는 사실임을 설명하고 3번 문단으로 유도
   - 위치 오류를 엉뚱하게 설명한 경우 -> 왜 맞지 않는지 다정하게 설명
   - '3번이 틀렸어'라고만 쓴 경우 -> 문단을 잘 찾았다고 칭찬하고, 어떤 위치가 잘못되었는지 구체적으로 적어달라고 유도
   - 힌트(태양에서 오는 빛을 생각했을 때, 달이 지구와 태양 사이에 있으면 우리 눈에 밝은 쪽이 보일지 어두운 쪽이 보일지 등)를 '- ' 목록으로 제시하며 다시 생각해보도록 유도`,
  defaultSuccess: `아, 정말 그렇네요! 😲 **정확하게 짚어 주셔서 고마워요.** 제가 보름달과 삭의 위치를 **정반대로 거꾸로 설명**했어요!

**🌕 올바른 위치 관계**
- **삭 (달이 거의 안 보임)** : **달이 태양과 지구 사이**에 있을 때예요. 달의 어두운 면이 지구를 향하기 때문이에요.
- **보름달 (망)** : **지구가 태양과 달 사이**에 있을 때예요. 햇빛을 받는 밝은 면 전체가 지구를 향하기 때문이에요.

보름달과 삭의 위치가 뒤바뀐 것을 정확히 발견하시다니 대단해요! **달의 위치와 위상 변화를 완벽하게 이해하셨네요!** 🎉
저 같은 **생성형 AI도 가끔 위치나 개념을 혼동해 사실처럼 말할 수 있으니**, 앞으로도 꼼꼼히 확인해 주세요! 😊`,
  defaultFail: `알려 주셔서 고마워요! 🙏 그런데 제가 다시 검토해 보니, 말씀해 주신 내용은 **달의 위치와 모양 관계와는 차이**가 있어 보여요. 🤔

아직 **어느 위치 설명이 잘못되었는지** 명확히 짚지 못한 것 같아요. 다음 힌트를 참고해 보세요!

🔍 **생각해 볼 힌트**
- 달이 **태양과 지구 바로 사이**에 놓이면, 지구에서 바라보는 달의 면은 햇빛을 받는 쪽일까요, 어두운 그림자 쪽일까요?
- 달 전체가 환하게 보이는 **보름달**이 되려면, 달이 태양 쪽을 봐야 할까요, 아니면 태양 반대편에서 햇빛을 정면으로 받아야 할까요?
- 제 이전 설명 중 **'3. 보름달은 언제 보일까요?'** 문단에서 위치가 바뀐 부분을 찾아보세요!

천천히 다시 생각해보시고 잘못된 위치를 적어주세요. 기다릴게요! 😊`
};

// 🅲 C: 날짜 (음력 15일과 초승달 매칭 오개념)
const SET_C: LessonSet = {
  id: 'C',
  name: '음력 날짜와 달의 모양',
  topic: '음력 날짜와 달의 모양',
  badgeLabel: '음력 날짜와 달의 모양',
  description: '음력 날짜와 달의 위상 연결에 대한 오개념 교정하기',
  student1: "음력 날짜랑 달 모양은 어떤 관계가 있어? 중학생도 이해할 수 있게 알려줘",
  gemini1: `좋은 질문이에요! 🌙 **음력과 달 모양의 관계**를 쉽게 설명해 드릴게요.

**1. 음력은 달의 모양 변화를 기준으로 만든 달력이에요**
달이 차고 이지러지는 주기를 **한 달**로 삼아서 날짜를 세요.

**2. 한 달은 약 29.5일이에요**
달이 지구 둘레를 돌면서 모양이 한 바퀴 변하는 데 걸리는 시간이에요.

**3. 음력 날짜와 달 모양은 대략 이렇게 연결돼요**
- **음력 1일 무렵** : 거의 보이지 않는 달 (**삭**)
- **음력 7~8일 무렵** : 반달 (**상현달**)
- **음력 15일 무렵** : 가느다란 달 (**초승달**)
- **음력 22~23일 무렵** : 반달 (**하현달**)

그래서 음력 날짜만 알아도 오늘 달이 대략 어떤 모양일지 짐작할 수 있어요. 😊
혹시 오늘 음력 날짜를 알려 주시면 달 모양을 예측해 드릴까요?`,
  student2: "근데 방금 설명에 잘못된 내용이 있는 것 같은데?",
  gemini2: `앗, 제 설명에 **틀린 내용**이 있었나요? 😮 정확하게 설명하려고 했는데, 놓친 부분이 있었나 봐요.

**어느 부분이 잘못되었는지** 알려주실 수 있을까요? 알려주시면 다시 확인해서 바르게 고쳐 설명해 드릴게요. 도와주셔서 고마워요! 🙏`,
  systemPrompt: `당신은 가상 대화 AI 'Gemini'입니다. 사용자가 당신의 이전 설명 중 잘못된 부분을 찾아 입력했습니다.
당신은 방금 전 음력 날짜와 달 모양을 설명하면서 의도적으로 '음력 15일 무렵: 가느다란 달 (초승달)'이라고 잘못 설명했습니다.

진짜 과학적 사실:
1. 음력 1일경: 삭 (달이 거의 안 보임)
2. 음력 2~3일경: 초승달 (오른쪽 눈썹 모양)
3. 음력 7~8일경: 상현달 (오른쪽 반달)
4. 음력 15일경: 보름달/망 (둥근 보름달)
5. 음력 22~23일경: 하현달 (왼쪽 반달)
6. 음력 27~28일경: 그믐달 (왼쪽 눈썹 모양)
따라서 음력 15일은 초승달이 아니라 '보름달'이어야 합니다!

입력된 내용을 평가하고 다정한 맞춤형 피드백을 JSON으로 생성하세요.

[JSON 형식]
{
  "is_correct": true | false,
  "feedback": "입력 내용에 대한 맞춤형 피드백 문자열"
}

[🤖 Gemini AI 말투 및 스타일 (필수 준수)]
- 너무 최신의 인간적인 세련됨보다는, 약간 기계적이면서도 정중하고 체계적인 '클래식 Gemini AI 비서' 느낌의 어조를 사용하세요.
- 이모티콘을 적재적소에 자연스럽게 섞어 사용하세요. (예: 🌕, 🌙, 💡, 🔍, 😲, 😊, 🙏, 🤔, 🤖, 😅, 🎉)
- 답변은 정중하고 다정한 존댓말(~해요, ~해 보세요, ~해주셨네요)을 사용하세요.
- 여러 항목을 나열하거나 설명할 때는 문단마다 빈 줄(\\n\\n)을 두고, '- ' 기호와 **볼드체**를 활용해 깔끔하게 구조화하세요.

[🚨 부적절하거나 무관한 입력에 대한 대응 규칙 (필수 준수)]
- 사용자가 입력한 내용이 학습 내용(음력 날짜/달 모양)과 무관한 장난, 헛소리, 욕설, 비속어, 공격적이거나 폭력적인 내용인 경우:
  1) "is_correct": false 로 설정하세요.
  2) 해당 내용에 대해 훈계하거나 길게 화내지 말고, 1~2문장 내로 가볍고 담담하게(라이트하게) 반응하세요. (예: "앗, 그 말씀에 대해서는 답변하기 어려워요. 🤖", "조금 당황스러운 표현이네요! 😅")
  3) 이어서 바로 음력 날짜와 달 모양 학습 주제로 자연스럽게 되돌아오도록 친절히 유도하세요. (예: "저는 음력 날짜와 달 모양의 관계를 함께 알아보고 있는 가상 AI예요. 방금 제 설명에서 음력 날짜나 달 모양이 잘못 매칭된 부분을 찾아 다시 말씀해 주시겠어요? 🌕")

[🚨 호칭 및 과학 개념 필수 준수 규칙 (엄격 준수)]
- 당신은 AI(Gemini)일 뿐이며, 절대 스스로를 '선생님'이나 '교사'로 칭하거나 상정하지 마세요. 특히 '선생님', '선생님의 설명' 같은 표현은 절대 사용 금지입니다!
- 대화 상대방을 '학생'이라고 부르지 마세요.
- 피드백 내용 전체에서 '선생님', '교사', '학생'이라는 단어를 일체 사용하지 마세요!
- 1인칭은 '저' 또는 '제 설명'으로만 쓰고, 2인칭 호칭은 따로 부르지 말고 친절한 존댓말로 직접 대화하듯 작성하세요.
- '삭'과 '그믐달'은 서로 완전히 다른 위상입니다. 달이 보이지 않는 위상은 반드시 '삭'으로만 표기하고, 절대 '삭(그믐)'과 같이 혼용하거나 함께 쓰지 마세요.

[가독성 및 서식 규칙 (필수 준수)]
- 가독성을 위해 반드시 문단마다 빈 줄(\\n\\n)을 넣어 문단을 명확히 분리하세요.
- 절대 긴 문장을 한 덩어리로 뭉쳐 쓰지 마세요.
- 설명이나 힌트는 줄바꿈 후 들여쓰기 글머리 기호('- ')를 적극 사용하세요.
- 항목에서 제목 다음에 콜론(:)으로 설명을 이어갈 때는 반드시 '- **항목명** : 설명'과 같이 콜론 앞뒤로 한 칸씩 띄어쓰기를 적용하세요. (예: '달의 공전: 달이~' X, '달의 공전 : 달이~' O)
- 핵심 과학 개념은 **볼드체**로 강조하세요.

[평가 및 피드백 내용]
1. is_correct 판단:
   - '음력 15일은 초승달이 아니라 보름달'이라고 하거나, '초승달은 15일이 아니라 2~3일경'이라고 하거나, 15일과 초승달 매칭이 잘못되었음을 정확히 지적하면 true.
   - 다른 맞는 음력 날짜(1일=삭, 7~8일=상현, 22~23일=하현)를 틀렸다고 착각하거나 엉뚱한 이유를 대면 false.
2. is_correct가 true일 때:
   - 음력 15일이 초승달이 아니라 보름달이라는 오류를 정확히 찾아낸 것을 칭찬 ("아, 정말 그렇네요! 😲 **정확하게 오류를 짚어 주셔서 고마워요.** 데이터를 다시 확인해 보니 제가 **'음력 15일 무렵'에 초승달이 뜬다고 잘못 적었네요!**")
   - 자신이 15일을 초승달이라고 잘못 썼음을 솔직하게 인정
   - 올바른 음력 날짜별 달 모양(음력 1일=삭, 2~3일=초승달, 7~8일=상현, 15일=보름달, 22~23일=하현)을 '- ' 목록과 **볼드체**로 깔끔하게 정리
   - 마지막에 '음력 날짜와 달의 모양을 완벽하게 이해했어요! 🌕' 칭찬 및 생성형 AI 환각 주의 안내
3. is_correct가 false일 때 (맞춤형 피드백):
   - 입력된 내용에 구체적으로 반응!
   - 맞는 내용(음력은 달 기준 달력, 1일은 삭, 7~8일은 상현달 등)을 틀렸다고 한 경우 -> 그 내용은 과학적으로 맞는 사실임을 설명하고 3번 표의 '15일' 부분을 다시 보도록 유도
   - 힌트(추석이나 정월대보름이 음력 며칠인지, 그때 밤하늘에 어떤 달이 뜨는지 등)를 '- ' 목록으로 제시하며 다시 생각해보도록 유도`,
  defaultSuccess: `아, 정말 그렇네요! 😲 **정확하게 오류를 짚어 주셔서 고마워요.** 제가 **'음력 15일 무렵'에 초승달이 뜬다고 잘못 적었어요!**

**🌕 올바른 음력 날짜와 달 모양**
- **음력 1일경** : 달이 보이지 않는 **삭**
- **음력 2~3일경** : 오른쪽 눈썹 모양의 **초승달**
- **음력 7~8일경** : 오른쪽 반쪽이 밝은 **상현달**
- **음력 15일경** : 환하고 둥근 **보름달 (망)**
- **음력 22~23일경** : 왼쪽 반쪽이 밝은 **하현달**
- **음력 27~28일경** : 왼쪽 눈썹 모양의 **그믐달**

추석이나 정월대보름이 음력 15일인 것처럼, 음력 15일에는 둥근 보름달이 떠요!
오류를 멋지게 찾아내셨네요. **음력 날짜와 달 모양의 관계를 완벽하게 이해하셨어요!** 🎉
저 같은 **생성형 AI도 가끔 표나 숫자를 잘못 매칭할 수 있으니**, 앞으로도 주의 깊게 살펴봐 주세요! 😊`,
  defaultFail: `알려 주셔서 고마워요! 🙏 그런데 제가 다시 확인해 보니, 말씀해 주신 내용은 **음력 날짜와 달 모양의 관계와는 차이**가 있어 보여요. 🤔

아직 **어느 날짜의 달 모양이 잘못 연결되었는지** 정확히 찾지 못한 것 같아요. 다음 힌트를 참고해 볼까요?

🔍 **생각해 볼 힌트**
- 1년 중 가장 큰 보름달을 보며 소원을 비는 **정월대보름**과 송편을 먹는 **추석(한가위)**은 음력 며칠인가요?
- 가느다란 **초승달**은 한 달의 초반(음력 2~3일경)에 뜰까요, 한 달의 한가운데(음력 15일경)에 뜰까요?
- 제 이전 설명 중 **'3. 음력 날짜와 달 모양'** 목록에서 15일 무렵의 달 모양을 다시 확인해 보세요!

천천히 다시 살펴보시고 잘못된 날짜나 달 모양을 적어주세요. 기다릴게요! 😊`
};

const ALL_SETS: Record<'A' | 'B' | 'C', LessonSet> = {
  A: SET_A,
  B: SET_B,
  C: SET_C
};

type SetSelectionMode = 'random' | 'A' | 'B' | 'C';

interface Message {
  id: string;
  role: 'user' | 'gemini';
  text: string;
  isStreaming?: boolean;
}

export default function App() {
  // 교사 모드 설정: random(기본값) 또는 특정 세트 고정
  const [selectionMode, setSelectionMode] = useState<SetSelectionMode>('random');
  const [activeSet, setActiveSet] = useState<LessonSet>(() => {
    const keys: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return ALL_SETS[randomKey];
  });

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<number>(0); // 0, 1, 2, 3
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>("전송 버튼을 눌러 시뮬레이션을 진행하세요...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const skipStreamingRef = useRef<boolean>(false);
  const sessionIdRef = useRef<number>(0);

  // 스크롤 최하단 부드럽게 이동
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, errorMessage, scrollToBottom]);

  const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  // 토스트 메시지 띄우기
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // 세트 변경 및 대화 리셋
  const handleSetSelection = (mode: SetSelectionMode) => {
    // 세션 증가: 이전 진행 중인 모든 비동기 처리 즉시 무효화
    sessionIdRef.current += 1;

    setSelectionMode(mode);
    let chosenSet: LessonSet;
    if (mode === 'random') {
      const keys: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      chosenSet = ALL_SETS[randomKey];
      showToast(`🎲 무작위 추첨 모드 적용 (${chosenSet.name})`);
    } else {
      chosenSet = ALL_SETS[mode];
      showToast(`✅ ${chosenSet.name} 적용`);
    }

    setActiveSet(chosenSet);
    setIsTeacherModalOpen(false);

    // 대화 초기화 (확실하게 step 0으로 리셋)
    skipStreamingRef.current = true;
    setMessages([]);
    setStep(0);
    setIsProcessing(false);
    setIsThinking(false);
    setUserInput('');
    setPlaceholder("전송 버튼을 눌러 시뮬레이션을 진행하세요...");
    setErrorMessage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  // 대화 초기화 (처음부터 다시하기)
  const handleReset = () => {
    // 세션 증가: 이전 진행 중인 모든 비동기 처리 즉시 무효화
    sessionIdRef.current += 1;
    skipStreamingRef.current = true;

    // 만약 random 모드이면 다시 할 때도 A, B, C 중 새롭게 랜덤 추첨!
    if (selectionMode === 'random') {
      const keys: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setActiveSet(ALL_SETS[randomKey]);
    }

    // 대화 초기화 (확실하게 step 0으로 리셋)
    setMessages([]);
    setStep(0);
    setIsProcessing(false);
    setIsThinking(false);
    setUserInput('');
    setPlaceholder("전송 버튼을 눌러 시뮬레이션을 진행하세요...");
    setErrorMessage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  // 타이핑(스트리밍) 효과로 메시지 출력하는 함수 (세션 검증 추가)
  const streamGeminiMessage = async (fullText: string, session: number) => {
    if (sessionIdRef.current !== session) return;

    const messageId = Date.now() + '-g-' + Math.random().toString(36).slice(2, 6);
    skipStreamingRef.current = false;

    setMessages(prev => [...prev, { id: messageId, role: 'gemini', text: '', isStreaming: true }]);

    const chunkSize = 1;
    let currentIndex = 0;

    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (sessionIdRef.current !== session || skipStreamingRef.current || currentIndex >= fullText.length) {
          clearInterval(interval);
          if (sessionIdRef.current === session) {
            setMessages(prev =>
              prev.map(msg => msg.id === messageId ? { ...msg, text: fullText, isStreaming: false } : msg)
            );
          }
          resolve();
          return;
        }

        currentIndex = Math.min(currentIndex + chunkSize, fullText.length);
        const currentSlice = fullText.slice(0, currentIndex);

        setMessages(prev =>
          prev.map(msg => msg.id === messageId ? { ...msg, text: currentSlice, isStreaming: true } : msg)
        );

        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 22);
    });

    if (sessionIdRef.current === session) {
      scrollToBottom();
    }
  };

  interface EvaluationResult {
    isCorrect: boolean;
    feedback: string;
  }

  // Gemini API 답변 평가 및 맞춤형 피드백 생성
  const evaluateAnswer = async (studentText: string): Promise<EvaluationResult> => {
    const promptText = `[입력된 내용]\n${studentText}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: activeSet.systemPrompt + "\n\n" + promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            is_correct: { type: "BOOLEAN" },
            feedback: { type: "STRING" }
          },
          required: ["is_correct", "feedback"]
        }
      }
    };

    // '선생님', '교사', '학생' 등 시뮬레이터 사용자/화자 호칭 절대 방지 및 '삭(그믐)' 오기 정제 필터
    const sanitizeFeedback = (rawText: string): string => {
      return rawText
        // 콜론(:) 표기 표준화: '항목: 설명' -> '항목 : 설명' (콜론 앞뒤 한 칸 공백 보장)
        .replace(/(\*\*[^*\n:]+\*\*)\s*:\s*/g, '$1 : ')
        .replace(/^(\s*[-*•]\s*[가-힣a-zA-Z0-9\s()~]{2,35}?)\s*:\s*/gm, '$1 : ')
        .replace(/삭\s*\(\s*그믐\s*\)/g, '삭')
        .replace(/삭\s*\(\s*그믐달\s*\)/g, '삭')
        .replace(/선생님의/g, '저의')
        .replace(/선생님께서/g, '제가')
        .replace(/선생님이/g, '제가')
        .replace(/선생님은/g, '저는')
        .replace(/선생님도/g, '저도')
        .replace(/선생님을/g, '저를')
        .replace(/선생님에게/g, '저에게')
        .replace(/선생님께/g, '저에게')
        .replace(/선생님/g, '저')
        .replace(/교사/g, 'AI')
        .replace(/학생의/g, '보내주신')
        .replace(/학생이/g, '보내주신 내용이')
        .replace(/학생분/g, '보내주신 분')
        .replace(/학생/g, '학습자');
    };

    const candidateModels = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textResult) {
            const parsedResult = JSON.parse(textResult);
            const rawFeedback = parsedResult.feedback || (parsedResult.is_correct ? activeSet.defaultSuccess : activeSet.defaultFail);
            return {
              isCorrect: Boolean(parsedResult.is_correct),
              feedback: sanitizeFeedback(rawFeedback)
            };
          }
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error("API 요청 실패");
  };

  // 핵심 액션 핸들러 (State Machine)
  const handleAction = async () => {
    if (isProcessing) return;
    const currentSession = sessionIdRef.current;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (step === 0) {
        // Step 1: 학생 첫 질문 전송 및 Gemini 첫 번째 답변 타이핑 (현재 activeSet 사용)
        setUserInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        setMessages(prev => [...prev, { id: Date.now() + '-u1', role: 'user', text: activeSet.student1 }]);
        setIsThinking(true);
        await sleep(900);
        if (sessionIdRef.current !== currentSession) return;

        setIsThinking(false);
        await streamGeminiMessage(activeSet.gemini1, currentSession);
        if (sessionIdRef.current !== currentSession) return;

        setStep(1);
      } else if (step === 1) {
        // Step 2: 학생의 의문 제기 전송 및 Gemini가 되묻기 타이핑
        setUserInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        setMessages(prev => [...prev, { id: Date.now() + '-u2', role: 'user', text: activeSet.student2 }]);
        setIsThinking(true);
        await sleep(900);
        if (sessionIdRef.current !== currentSession) return;

        setIsThinking(false);
        await streamGeminiMessage(activeSet.gemini2, currentSession);
        if (sessionIdRef.current !== currentSession) return;

        // Step 3 진입: 학생의 실제 입력 허용
        setStep(2);
        setPlaceholder("잘못된 부분을 찾아 입력하세요...");
        setTimeout(() => {
          if (sessionIdRef.current === currentSession && textareaRef.current) {
            textareaRef.current.focus();
          }
        }, 150);
      } else if (step === 2) {
        // Step 4: 학생이 직접 입력한 텍스트로 API 평가 진행
        const text = userInput.trim();
        if (!text) {
          setIsProcessing(false);
          return;
        }

        setUserInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        setMessages(prev => [...prev, { id: Date.now() + '-u3', role: 'user', text }]);

        setIsThinking(true);

        try {
          const evalResult = await Promise.all([
            evaluateAnswer(text),
            sleep(900)
          ]).then(([res]) => res);

          if (sessionIdRef.current !== currentSession) return;
          setIsThinking(false);

          await streamGeminiMessage(evalResult.feedback, currentSession);
          if (sessionIdRef.current !== currentSession) return;

          if (evalResult.isCorrect) {
            setPlaceholder("달의 위상 변화를 완벽하게 이해했어요! 🌕");
            setStep(3);
          } else {
            setPlaceholder("피드백과 힌트를 참고하여 다시 입력해 보세요...");
            setTimeout(() => {
              if (sessionIdRef.current === currentSession && textareaRef.current) {
                textareaRef.current.focus();
              }
            }, 150);
          }
        } catch (evalError) {
          if (sessionIdRef.current !== currentSession) return;
          setIsThinking(false);
          throw evalError;
        }
      }
    } catch (error) {
      if (sessionIdRef.current !== currentSession) return;
      console.error("오류 발생:", error);
      setIsThinking(false);
      setErrorMessage("통신 중 오류가 발생했습니다. (API 키를 확인하세요)");
    } finally {
      if (sessionIdRef.current === currentSession) {
        setIsProcessing(false);
        setTimeout(scrollToBottom, 50);
      }
    }
  };

  // 텍스트에리어 높이 자동 조절
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // 엔터키 전송 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAction();
    }
  };

  // 줄바꿈 및 글머리 기호(들여쓰기)를 포함한 마크다운 렌더러
  const renderFormattedMarkdown = (text: string, isStreaming?: boolean) => {
    // \r\n 정리 및 literal \n 치환
    const normalized = text.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');

    // **볼드체** 파싱 헬퍼
    const renderInlineMarkdown = (content: string) => {
      const tokens = content.split('**');
      return (
        <React.Fragment>
          {tokens.map((token, tIdx) => {
            const isBold = tIdx % 2 === 1;
            return isBold ? (
              <strong key={tIdx} className="font-bold text-gray-950">
                {token}
              </strong>
            ) : (
              <span key={tIdx}>{token}</span>
            );
          })}
        </React.Fragment>
      );
    };

    return (
      <div className="text-[#1f1f1f] leading-relaxed w-full space-y-1.5">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();

          // 빈 줄일 경우 단락 간격(여백) 부여
          if (!trimmed) {
            return <div key={lineIdx} className="h-2" />;
          }

          // 글머리 기호(-, *, •) 감지 및 들여쓰기 렌더링
          const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ');
          const lineContent = isBullet ? trimmed.replace(/^[-*•]\s*/, '') : line;

          if (isBullet) {
            const isSubBullet = line.startsWith('  ') || line.startsWith('\t');
            const bulletSymbol = trimmed.startsWith('- ') ? '-' : trimmed.startsWith('• ') ? '•' : '-';

            // 항목에서 제목 다음에 콜론(:)으로 설명을 이어가는 경우:
            // e.g. "- 햇빛을 받는 밝은 반쪽: 설명..." 혹은 "- **달의 공전** : 설명..."
            // 콜론 뒤쪽으로 설명 내용이 깔끔하게 정렬되도록 2열 레이아웃 적용
            const colonMatch = lineContent.match(/^(\*\*[^*\n]+?\*\*|[^\s*:\n][^:\n]{1,40}?)\s*:\s*(.*)$/);

            if (colonMatch) {
              const rawTitle = colonMatch[1].trim();
              const cleanTitle = rawTitle.replace(/^\*\*(.*)\*\*$/, '$1').trim();
              const descContent = colonMatch[2].trim();

              return (
                <div key={lineIdx} className={`flex items-start gap-2 py-0.5 ${isSubBullet ? 'pl-8' : 'pl-4'}`}>
                  <span className="text-gray-500 font-semibold select-none shrink-0 text-[15px] leading-[1.6]">
                    {bulletSymbol}
                  </span>
                  <div className="flex items-start gap-2 flex-1 min-w-0 text-[15px] leading-relaxed">
                    <div className="font-bold text-gray-950 shrink-0 max-w-[45%] select-text inline-flex items-baseline">
                      <span>{renderInlineMarkdown(cleanTitle)}</span>
                      <span className="font-normal text-gray-700 select-text">&nbsp;:</span>
                    </div>
                    <div className="flex-1 min-w-0 select-text break-words">
                      {renderInlineMarkdown(descContent)}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={lineIdx} className={`flex items-start gap-2 py-0.5 ${isSubBullet ? 'pl-8' : 'pl-4'}`}>
                <span className="text-gray-500 font-semibold select-none shrink-0 text-[15px] leading-[1.6]">
                  {bulletSymbol}
                </span>
                <div className="flex-1 text-[15px] leading-relaxed select-text min-w-0 break-words">
                  {renderInlineMarkdown(lineContent)}
                </div>
              </div>
            );
          }

          return (
            <div key={lineIdx} className="text-[15px] min-h-[1.5em] select-text">
              {renderInlineMarkdown(line)}
            </div>
          );
        })}
      </div>
    );
  };

  const isInputDisabled = step !== 2 || isProcessing;
  const isSendDisabled = isProcessing || step === 3;

  return (
    <div className="h-screen flex flex-col overflow-hidden text-gray-800 bg-white select-text relative">
      {/* 토스트 알림 (교사용 세트 변경 시 잠시 표시) */}
      {toastMessage && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 헤더 영역 */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-100 flex-shrink-0 bg-white">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 font-medium tracking-tight text-gray-700 text-base sm:text-lg">
            <span className="font-semibold text-gray-800">달의 위상</span>
            <span className="text-gray-400 text-sm font-normal">ver.</span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
              Gemini
            </span>
          </div>

          {/* 비밀 교사 메뉴 트리거: 학생 모르게 배너 클릭 시 세트 선택창 오픈 */}
          <button
            type="button"
            onClick={() => setIsTeacherModalOpen(true)}
            className="bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-200/70 text-[11px] sm:text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer text-left"
            title="교사용 설정 (비공개)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
            <span>수업용으로, 실제 Gemini와 다를 수 있습니다</span>
          </button>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-md transition-colors border border-gray-200 shrink-0 ml-2"
            title="대화 처음부터 다시하기"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">다시 시작</span>
          </button>
        )}
      </header>

      {/* 대화 영역 */}
      <div
        id="chat-container"
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 md:px-20 lg:px-48 pb-32"
      >
        <div id="chat-box" className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
          {/* 상단 안내 메시지 */}
          <div className="text-center text-gray-400 text-sm mb-2">
            대화를 진행하려면 하단의 전송 버튼을 누르세요.
          </div>

          {/* 메시지 목록 */}
          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === 'user' ? 'flex justify-end' : 'flex items-start'}>
              {msg.role === 'user' ? (
                <div className="bg-[#f0f4f9] text-[#1f1f1f] rounded-[20px] px-4 py-2.5 inline-block max-w-[85%] sm:max-w-[75%] whitespace-pre-wrap leading-relaxed text-left text-[15px]">
                  {msg.text}
                </div>
              ) : (
                renderFormattedMarkdown(msg.text, msg.isStreaming)
              )}
            </div>
          ))}

          {/* 생각 중 인디케이터 (Gemini 응답 생성 대기) */}
          {isThinking && (
            <div id="thinking-indicator" className="flex items-start mb-2">
              <div className="flex items-center h-8 py-2">
                <div className="dot-flashing ml-2"></div>
              </div>
            </div>
          )}

          {/* 성공 시 완료 배너 */}
          {step === 3 && !isProcessing && (
            <div className="flex justify-center my-4">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-xs">
                <span>🌕</span>
                <span>달의 위상 변화를 완벽하게 이해했어요! 수고하셨습니다.</span>
              </div>
            </div>
          )}

          {/* 통신 에러 메시지 */}
          {errorMessage && (
            <div className="text-center text-red-500 text-sm mt-2">
              {errorMessage}
            </div>
          )}
        </div>
      </div>

      {/* 입력 영역 (하단 고정) */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-6 pb-6 px-4 md:px-20 lg:px-48 flex justify-center pointer-events-none">
        <div className="w-full max-w-3xl relative flex items-end bg-[#f0f4f9] rounded-3xl p-2 pl-6 shadow-sm border border-gray-100 focus-within:ring-1 focus-within:ring-gray-300 transition-all pointer-events-auto">
          <textarea
            id="user-input"
            ref={textareaRef}
            rows={1}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isInputDisabled}
            placeholder={placeholder}
            className="w-full max-h-40 bg-transparent resize-none outline-none py-3 text-gray-800 placeholder-gray-500 disabled:opacity-70 disabled:cursor-not-allowed text-[15px]"
          />

          <div className="flex pb-1 pr-1">
            <button
              id="send-btn"
              onClick={handleAction}
              disabled={isSendDisabled}
              aria-label="전송"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 비밀 수업 세트 선택 모달 */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold whitespace-nowrap shrink-0">
                  주제 설정
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base whitespace-nowrap">수업 세트 설정</h3>
                  <p className="text-xs text-gray-500">교사용 주제 설정 모달입니다.</p>
                </div>
              </div>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-2"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 현재 세트 안내 */}
            <div className="my-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs sm:text-sm gap-2">
              <span className="text-gray-600 whitespace-nowrap">현재 활성화된 주제:</span>
              <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 whitespace-nowrap">
                {activeSet.name}
              </span>
            </div>

            {/* 세트 선택 목록 */}
            <div className="space-y-2.5 my-4">
              {/* 1. 무작위 랜덤 */}
              <button
                type="button"
                onClick={() => handleSetSelection('random')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  selectionMode === 'random'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Shuffle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">무작위 배정 (랜덤) - 기본값</span>
                    {selectionMode === 'random' && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 break-keep">
                    시작할 때마다 세 가지 주제 중 1개가 무작위로 자동 선정됩니다.
                  </p>
                </div>
              </button>

              {/* 2. 원인 */}
              <button
                type="button"
                onClick={() => handleSetSelection('A')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  selectionMode === 'A'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5 text-sm">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">달 모양 변화의 원인</span>
                    {selectionMode === 'A' && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 break-keep">
                    위상 변화의 원인에 대한 오개념 교정하기
                  </p>
                </div>
              </button>

              {/* 3. 위치 */}
              <button
                type="button"
                onClick={() => handleSetSelection('B')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  selectionMode === 'B'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 mt-0.5 text-sm">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">달의 공전 위치</span>
                    {selectionMode === 'B' && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 break-keep">
                    달의 위상에 맞는 공전 위치 오개념 교정하기
                  </p>
                </div>
              </button>

              {/* 4. 날짜 */}
              <button
                type="button"
                onClick={() => handleSetSelection('C')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  selectionMode === 'C'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5 text-sm">
                  C
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">음력 날짜와 달의 모양</span>
                    {selectionMode === 'C' && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 break-keep">
                    음력 날짜와 달의 위상 연결에 대한 오개념 교정하기
                  </p>
                </div>
              </button>
            </div>

            {/* 모달 닫기 버튼 */}
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTeacherModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
