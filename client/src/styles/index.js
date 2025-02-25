const styles = {
  // general
  headText: 'font-rajdhani font-bold text-white sm:text-6xl text-4xl',
  normalText: 'font-rajdhani font-normal text-[24px] text-siteWhite',
  footerText: 'font-rajdhani font-medium text-base text-white',
  infoText: 'font-rajdhani font-medium text-lg text-siteViolet cursor-pointer',

  // glassmorphism
  glassEffect: 'bg-white backdrop-filter backdrop-blur-lg bg-opacity-10',

  // hoc page
  hocContainer: 'min-h-screen flex xl:flex-row flex-col relative',
  hocContentBox: 'flex flex-1 justify-between bg-siteblack py-8 sm:px-12 px-8 flex-col',
  hocLogo: 'w-[160px] h-[52px] object-contain cursor-pointer',
  hocBodyWrapper: 'flex-1 flex justify-center flex-col xl:mt-0 my-16',

  // join battle page
  joinHeadText: 'font-rajdhani font-semibold text-2xl text-white mb-3',
  joinContainer: 'flex flex-col gap-3 mt-3 mb-5',
  joinBattleTitle: 'font-rajdhani font-normal text-xl text-white',
  joinLoading: 'font-rajdhani font-normal text-xl text-white',

  // battleground page
  battlegroundContainer: 'min-h-screen bg-landing flex-col py-12 px-4',
  battleGroundsWrapper: 'flex-wrap mt-10 max-w-[1200px]',
  battleGroundCard: 'sm:w-[420px] w-full h-[260px] p-2 glass-morphism m-4 rounded-lg cursor-pointer battle-card',
  battleGroundCardImg: 'w-full h-full object-cover rounded-md',
  battleGroundCardText: 'font-rajdhani font-semibold text-2xl text-white',

  // Game page
  gameContainer: 'w-screen h-screen bg-cover bg-no-repeat bg-center flex-col',
  gameMoveBox: 'sm:w-12 w-10 sm:h-12 h-10 rounded-full cursor-pointer border-[2px]',
  gameMoveIcon: 'w-1/2 h-1/w-1/2 object-contain',

  // player info component
  playerImg: 'w-8 h-8 object-contain rounded-full',
  playerHealth: 'flex flex-row bg-white rounded-md p-1 sm:min-w-[200px] min-w-[180px] sm:min-h-[32px] min-h-[28px] bg-opacity-10 backdrop-filter backdrop-blur-lg mx-2',
  playerHealthBar: 'sm:text-base text-sm',
  playerMana: 'w-8 h-8 rounded-full text-white font-rajdhani font-extrabold text-base cursor-pointer',
  playerInfo: 'font-rajdhani font-medium',
  playerInfoSpan: 'font-extrabold text-white',

  // card component
  cardContainer: 'relative sm:w-[260px] w-[220px] sm:h-[335px] h-[280px] z-0 transition-all',
  cardImg: 'w-full h-full object-contain',
  cardPointContainer: 'absolute sm:w-[40px] w-[32px] sm:h-[40px] h-[32px] rounded-[25px] bottom-[31.4%]',
  cardPoint: 'font-rajdhani text-[20px] font-bold',
  cardTextContainer: 'absolute w-full bottom-[13.5%] left-3',
  cardText: 'font-rajdhani text-[26px] font-bold text-white',

  // DQN card component
  cardDqnContainer: 'relative sm:w-[240px] w-[200px] sm:h-[340px] h-[300px] z-0',
  cardDqnImg: 'w-full h-full object-contain',
  cardDqnImageContainer: 'absolute top-[25%] left-1/2 transform -translate-x-1/2 w-[60%] h-[30%] z-20 overflow-hidden rounded-md',
  cardDqnHexagon: 'absolute top-[6%] right-[6%] z-30 flex items-center justify-center w-[48px] h-[48px]',
  cardDqnTriangleAttack: 'absolute bottom-[13%] right-[16%] z-30 flex items-center justify-center w-[40px] h-[40px]',
  cardDqnTriangleDefense: 'absolute bottom-[13%] left-[16%] z-30 flex items-center justify-center w-[40px] h-[40px]',
  cardDqnName: 'absolute bottom-[4%] left-1/2 transform -translate-x-1/2 z-30 w-full text-center',

  // custom button component
  btn: 'px-4 py-2 rounded-lg bg-siteViolet w-fit text-white font-rajdhani font-bold',

  // custom input component
  label: 'font-rajdhani font-semibold text-2xl text-white mb-3',
  input: 'bg-siteDimBlack text-white outline-none focus:outline-siteViolet p-4 rounded-md sm:max-w-[50%] max-w-full',

  // gameload component
  gameLoadContainer: 'absolute inset-0 z-10 w-full h-screen gameload flex-col',
  gameLoadBtnBox: 'w-full flex justify-end px-8',
  gameLoadText: 'font-rajdhani text-siteWhite text-2xl mt-5 text-center',
  gameLoadPlayersBox: 'flex justify-evenly items-center mt-20',
  gameLoadPlayerImg: 'md:w-36 w-24 md:h-36 h-24 object-contain rounded-full drop-shadow-lg',
  gameLoadPlayerText: 'mt-3 font-rajdhani text-white md:text-xl text-base',
  gameLoadVS: 'font-rajdhani font-extrabold text-siteViolet text-7xl mx-16',

  // gameInfo component
  gameInfoIconBox: 'absolute left-2 top-1/2 transform -translate-y-1/2',
  gameInfoIcon: 'bg-black w-10 h-10 rounded-md cursor-pointer',
  gameInfoIconImg: 'w-3/5 h-3/5 object-contain invert',
  gameInfoSidebar: 'absolute p-6 left-0 top-1/2 -translate-y-1/2 h-screen rounded-md flex-col transition-all ease-in duration-300',
  gameInfoSidebarCloseBox: 'flex justify-end mb-8',
  gameInfoSidebarClose: 'w-10 h-10 rounded-md bg-siteViolet text-white font-rajdhani font-extrabold text-xl cursor-pointer',
  gameInfoHeading: 'font-rajdhani font-bold text-white text-3xl',
  gameInfoText: 'font-rajdhani font-medium text-white text-xl mb-2',

  // common
  flexCenter: 'flex items-center justify-center',
  flexEnd: 'flex justify-end items-end',
  flexBetween: 'flex justify-between items-center',

  // alert
  info: 'text-blue-700 bg-blue-100 dark:bg-blue-200 dark:text-blue-800',
  success: 'text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800',
  failure: 'text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800',
  alertContainer: 'absolute z-10 top-5 left-0 right-0',
  alertWrapper: 'p-4 rounded-lg font-rajdhani font-semibold text-lg ',
  alertIcon: 'flex-shrink-0 inline w-6 h-6 mr-2',

  // modal
  modalText: 'font-rajdhani font-bold text-3xl text-white mb-6 text-center',
};

export default styles;
