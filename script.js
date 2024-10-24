let doors = [];
let chosenDoor = null;
let revealedDoor = null; // 진행자가 연 문을 저장할 변수
let carCount = 0;
let goatCount = 0;
let attemptCount = 0;
let autoRepeatInterval;

document.querySelectorAll('.door').forEach((door, index) => {
    door.addEventListener('click', () => {
        if (chosenDoor === null) {
            chosenDoor = index; // 사용자가 선택한 문 저장
            door.src = "door_chosen.png"; // 선택한 문 이미지로 변경
            revealGoat(index); // 염소인 문 열기
        }
    });
});

function revealGoat(chosen) {
    let goatDoor;
    do {
        goatDoor = Math.floor(Math.random() * 3); // 0, 1, 2 중 랜덤 선택
    } while (goatDoor === chosen || doors[goatDoor] === 1); // 선택한 문 또는 자동차 문이 아닐 때까지 반복

    revealedDoor = goatDoor; // 진행자가 연 문 저장
    document.getElementById(`door${revealedDoor}`).src = "door_open.png"; // 염소 문 열기
    document.getElementById('switchBtn').disabled = false; // 선택 변경 버튼 활성화
}

document.getElementById('switchBtn').addEventListener('click', () => {
    if (chosenDoor !== null && revealedDoor !== null) {
        // 선택 변경: 진행자가 연 문을 제외한 나머지 문으로 변경
        chosenDoor = 3 - chosenDoor - revealedDoor; // 0, 1, 2 중 남은 문 선택
        document.getElementById(`door${chosenDoor}`).src = "door_chosen.png"; // 바꾼 문 이미지로 변경
        showResult(); // 결과 표시
        document.getElementById('switchBtn').disabled = true; // 버튼 비활성화
    }
});

function showResult() {
    const resultText = document.getElementById('result');
    const resultImage = document.getElementById('resultImage');
    
    attemptCount++; // 시도 횟수 증가
    
    if (doors[chosenDoor] === 1) {
        resultText.textContent = "축하합니다! 자동차를 찾으셨습니다!";
        carCount++; // 자동차 카운트 증가
        resultImage.src = "car.png"; // 결과 이미지: 자동차
    } else {
        resultText.textContent = "아쉽네요, 염소를 찾으셨네요.";
        goatCount++; // 염소 카운트 증가
        resultImage.src = "goat.png"; // 결과 이미지: 염소
    }

    // 통계 업데이트
    updateStatistics();

    resultImage.style.display = "block"; // 결과 이미지 표시
}

function updateStatistics() {
    const statsText = document.getElementById('stats');
    const carProbability = (carCount / attemptCount) * 100; // 자동차 당첨 확률 계산
    statsText.textContent = `시도 횟수: ${attemptCount}, 자동차 횟수: ${carCount}, 염소 횟수: ${goatCount}, 당첨 확률: ${carProbability.toFixed(2)}%`;
}

document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('initializeBtn').addEventListener('click', initializeGame);
document.getElementById('autoRepeatBtn').addEventListener('click', startAutoRepeat);
document.getElementById('stopRepeatBtn').addEventListener('click', stopAutoRepeat);

function resetGame() {
    chosenDoor = null;
    revealedDoor = null; // 진행자가 연 문 초기화
    doors = generateDoors();
    document.querySelectorAll('.door').forEach(door => {
        door.src = "door_closed.png"; // 모든 문을 닫힌 상태로 초기화
    });
    document.getElementById('result').textContent = ""; // 결과 텍스트 초기화
    document.getElementById('resultImage').style.display = "none"; // 결과 이미지 숨기기
    document.getElementById('switchBtn').disabled = true; // 선택 변경 버튼 비활성화
    
    // 통계 초기화는 하지 않음
}

function initializeGame() {
    resetGame();
    doors = generateDoors(); // 여기서 자동차와 염소를 랜덤으로 배치합니다.
    document.getElementById('resetBtn').disabled = false; // 다시 시작 버튼 활성화
}

function generateDoors() {
    const doors = [0, 0, 0]; // 0은 염소, 1은 자동차
    const randomIndex = Math.floor(Math.random() * 3);
    doors[randomIndex] = 1; // 랜덤으로 자동차 배치
    return doors;
}

function startAutoRepeat() {
    autoRepeatInterval = setInterval(() => {
        resetGame(); // 게임 초기화
        doors = generateDoors(); // 문 랜덤 생성
        chosenDoor = 0; // 항상 첫 번째 문 선택
        revealGoat(chosenDoor); // 염소 문 열기
        switchChosenDoor(); // 문 바꾸기
    }, 500); // 500ms 간격으로 자동 반복

    // 버튼 상태 업데이트
    document.getElementById('autoRepeatBtn').disabled = true; // 자동 반복 버튼 비활성화
    document.getElementById('stopRepeatBtn').disabled = false; // 반복 중단 버튼 활성화
}

function stopAutoRepeat() {
    clearInterval(autoRepeatInterval); // 자동 반복 중지
    document.getElementById('autoRepeatBtn').disabled = false; // 자동 반복 버튼 활성화
    document.getElementById('stopRepeatBtn').disabled = true; // 반복 중단 버튼 비활성화
}

function switchChosenDoor() {
    // 진행자가 연 문을 제외한 나머지 문으로 변경
    chosenDoor = 3 - chosenDoor - revealedDoor; // 0, 1, 2 중 남은 문 선택
    showResult(); // 결과 표시
}

// 초기화 버튼 수정
document.getElementById('initializeBtn').addEventListener('click', () => {
    resetGame();
    // 통계 초기화
    carCount = 0;
    goatCount = 0;
    attemptCount = 0;
    updateStatistics(); // 초기화된 통계 업데이트
    doors = generateDoors(); // 여기서 자동차와 염소를 랜덤으로 배치합니다.
    document.getElementById('resetBtn').disabled = false; // 다시 시작 버튼 활성화
});
