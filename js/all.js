
/*定義一個函式來執行遊戲*/
function startGame() {
    //完成區域左上角
    let finishArea = [[], [], [], []];
    //卡片暫放區(每一格只能放一張)右上角
    let temporaryArea = [];
    //主要遊戲區共8排
    let maingameArea = [
        [], //7張
        [], //7張
        [], //7張
        [], //7張
        [], //6張
        [], //6張
        [], //6張
        [] //6張
    ];
    /*隨機發牌設計*/
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let pokerArr = [];
    for (let i = 0; i < 52; i++) {
        pokerArr.push(i + 1)
    }

    // let pokerArr =Array.from(new Array(52)).map(function(item,index){
    //     return index+1 
    // })

    let pokerRandom = shuffle(pokerArr);

    function mainpokerArr() {
        let randomarrNum = Math.floor(Math.random() * 8);
        if (randomarrNum <= 3) {
            if (maingameArea[randomarrNum].length >= 7) {
                return mainpokerArr()
            }
        } else {
            if (maingameArea[randomarrNum].length >= 6) {
                return mainpokerArr()
            }
        }
        return randomarrNum;
    }

    pokerRandom.map(function (item) {
        let runmainpokerArr = mainpokerArr();
        maingameArea[runmainpokerArr].push(item);
    });

    function judgeColor(cardNum) {
        if (cardNum >= 1 && cardNum <= 13) {
            return 'spade'
        } else if (cardNum >= 14 && cardNum <= 26) {
            return 'heart'
        } else if (cardNum >= 27 && cardNum <= 39) {
            return 'diamond'
        } else if (cardNum >= 40 && cardNum <= 52) {
            return 'club'
        }
    };



    /*將牌渲染到畫面上*/
    let gamingArea = document.getElementById('gamingArea');

    //這裡要將7張牌的分成一區，6張牌的分成一區
    let cardbigGroup = [[], []];
    maingameArea.forEach(function (item, index) {
        if (index <= 3) {
            cardbigGroup[0].push(item);
        } else {
            cardbigGroup[1].push(item)
        };
    });

    function putCard() {
        cardbigGroup.forEach(function (section, sectionNum) {
            let cardbiggroupPart = document.createElement('div');
            cardbiggroupPart.className = 'col-6 d-flex w-100'
            section.forEach(function (item, index) {
                let cardGroup = document.createElement('div');
                cardGroup.className = 'relative w-100'
                item.forEach(function (el, num) {
                    let oneCard = document.createElement('div');
                    oneCard.className = 'cardArea absolute';
                    oneCard.card = el;
                    oneCard.group = index;
                    oneCard.style.transition = 'all .3s'
                    oneCard.style.top = '-1000px';
                    oneCard.style.left = '-2000px';
                    setTimeout(function () {
                        oneCard.style.top = num * 30 + 'px';
                        oneCard.style.left = '0px'
                    }, index * num * 30)
                    oneCard.innerHTML = `<img src="pokerimg/card-${judgeColor(el)}-${el % 13}.svg">`
                    cardGroup.appendChild(oneCard);
                })
                cardbiggroupPart.appendChild(cardGroup)
            })
            gamingArea.appendChild(cardbiggroupPart);
        });  
    }
    putCard();
}
startGame();

