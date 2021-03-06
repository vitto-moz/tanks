const styles: any = {
    tankWrap: {
        position: 'absolute',
        transformOrigin: 'center',
        backgroundColor: 'transparent',
        overflow: 'visible',
        width: '100px',
        height: '100px',
        zIndex: 1
    },
    tank: {
        position: 'relative',
        transformOrigin: 'center',
        backgroundColor: 'transparent',
        width: '100px',
        height: '100px',
        zIndex: 1
    },
    name: {
        position: 'absolute',
        width: '200px',
        zIndex: 2,
        top: '-57px',
        color: 'white',
        textAlign: 'center',
        fontSize: '25px',
        right: '-49px',
        fontFamily: 'monospace'
    },
    starsWrap: {
        position: 'absolute',
        width: '200px',
        height: '20px',
        zIndex: 7,
        top: '-79px',
        left: '-50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
};

export default styles
