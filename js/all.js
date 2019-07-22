/*定義一個函式來執行遊戲*/
function startGame() {
    //完成區域左上角
    let finishArea = [[], [], [], []];
    //卡片暫放區(每一格只能放一張)右上角
    let temporaryArea = [[], [], [], []];
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
    /*拖曳效果數值儲存*/
    let ondragCard = null  // 負責儲存被抓取卡片的數字
    ondragGroup = null  //負責儲存被抓取卡片所在的排數
    ondragSection = null //負責儲存被抓取卡片所在的區域
    ondropCard = null   //負責儲存被堆疊的卡片數字
    ondropGroup = null  //負責儲存被堆疊的卡片所在排數
    ondropSection = null //負責儲存被堆疊的卡片所在區域
    isgamePause = false
    isFinished = false
    isTemporary = false
    isRefresh = false

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



    /*將發牌渲染到畫面上*/
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
                cardGroup.className = 'relative w-100';
                cardGroup.style.height = '1000px'
                cardGroup.group = index;
                cardGroup.section = sectionNum;
                item.forEach(function (el, num) {
                    let oneCard = document.createElement('div');
                    // if (!isgamePause && num + 1 == item.length) {
                    //     oneCard.draggable = true;
                    //     cardImg.draggable = true
                    // }
                    // oneCard.card = `${judgeColor(el)} ${el % 13}`;
                    oneCard.className = 'cardArea absolute';
                    // oneCard.color = judgeColor(el);
                    // oneCard.section = sectionNum;
                    // oneCard.group = index;
                    if (!isRefresh) {
                        oneCard.style.transition = 'all .3s'
                        oneCard.style.top = '-1000px';
                        oneCard.style.left = '-2000px';
                        setTimeout(function () {
                            oneCard.style.top = num * 30 + 'px';
                            oneCard.style.left = '0px'
                        }, index * num * 30)
                    } else {
                        oneCard.style.top = num * 30 + 'px';
                        oneCard.style.left = '0px'
                    }
                    // oneCard.innerHTML = `<img src="pokerimg/card-${judgeColor(el)}-${el % 13}.svg" draggable = false class="${judgeColor(el)} ${el % 13}">`
                    let cardImg = document.createElement('img');
                    cardImg.draggable = false
                    cardImg.card = el;
                    cardImg.section = sectionNum;
                    cardImg.group = index;
                    cardImg.src = `pokerimg/card-${judgeColor(el)}-${el % 13}.svg`;
                    if (!isgamePause && num + 1 == item.length) {
                        oneCard.draggable = true;
                        cardImg.draggable = true
                    }
                    oneCard.appendChild(cardImg)
                    cardGroup.appendChild(oneCard);
                })
                cardbiggroupPart.appendChild(cardGroup)
            })

            gamingArea.appendChild(cardbiggroupPart);
        });

    };
    putCard();

    /*上方完成牌區渲染*/
    function sortColor(areaNum) {
        if (areaNum == 0) {
            return 'spade'
        } else if (areaNum == 1) {
            return 'heart'
        } else if (areaNum == 2) {
            return 'diamond'
        } else if (areaNum == 3) {
            return 'club'
        }
    }
    let finished = document.getElementById('finished')
    function storefinishCard() {
        finishArea.forEach(function (item, index) {
            let completedDeck = document.createElement('div');
            completedDeck.className = 'cardArea mr-4 bg-secondary d-flex justify-content-center align-items-center rounded'
            completedDeck.innerHTML = `<img src="icons/${sortColor(index)}-24px.svg" style="opacity: 0.8">`
            completedDeck.id = `${sortColor(index)}`
            finished.appendChild(completedDeck);

        })

    }

    storefinishCard()

    /*上方暫放牌區渲染*/
    let temporary = document.getElementById('temporary')
    function storetempCard() {
        temporaryArea.forEach(function (item, index) {
            let temporaryDeck = document.createElement('div');
            temporaryDeck.className = 'cardArea mr-4 bg-secondary rounded';
            temporary.appendChild(temporaryDeck);
        })
    }

    storetempCard();

    /*拖曳效果各事件觸發函式*/
    function refreshWindow() {
        isRefresh = true
        finished.innerHTML = ''
        temporary.innerHTML = ''
        gamingArea.innerHTML = ''
        putCard();
        storefinishCard();
        storetempCard();

    }

    function dragStart(e) {
        e.defaultPrevented;
        if (isgamePause) {
            return
        }
        ondragCard = e.target.card;
        ondragGroup = e.target.group;
        ondragSection = e.target.section;
        // console.log(ondragCard,ondragGroup,ondragSection)
    };

    function dragEnter(e) {
        e.defaultPrevented;
        // console.log(e.target.card,e.target.group,e.target.section)
        if (e.target.id === 'gamingArea') {
            return
        }
        if (e.target.id === 'finished') {
            isFinished = true
        }
        if (e.target.id === 'temporary') {
            isTemporary = true
        }
        ondropCard = e.target.card;
        ondropGroup = e.target.group;
        ondropSection = e.target.section;

        console.log(ondropCard,ondropGroup,ondropSection)

        if (ondropCard === ondragCard) {
            return
        }

    };

    function dragLeave(e) {
        if (e.target.id !== finished) {
            isFinished = false
        }
        if (e.target.id !== temporary) {
            isTemporary = false
        }
    };

    function dragEnd(e) {
        if (isgamePause) {
            return
        }
        if (!isFinished && !isTemporary) {
            let moveCard = cardbigGroup[ondragSection][ondragGroup].pop();
            cardbigGroup[ondropSection][ondropGroup].push(moveCard);
            // console.log(cardbigGroup[ondragSection][ondragGroup],moveCard,cardbigGroup[ondropSection][ondropGroup])
        }

        refreshWindow();
    }


    /*拖曳效果事件監聽*/
    let container = document.getElementById('container');
    container.addEventListener('dragstart', dragStart);
    container.addEventListener('dragenter', dragEnter);
    container.addEventListener('dragleave', dragLeave);
    container.addEventListener('dragend', dragEnd)
    // let spadeFinish = document.getElementById('spade');
    // let heartFinish = document.getElementById('heart');
    // let diamondFinish = document.getElementById('diamond');
    // let clubFinish = document.getElementById('club');
    // spadeFinish.addEventListener('dragenter',dragEnter);
    // heartFinish.addEventListener('dragenter',dragEnter);
    // diamondFinish.addEventListener('dragenter',dragEnter);
    // clubFinish.addEventListener('dragenter',dragEnter);

}
startGame();