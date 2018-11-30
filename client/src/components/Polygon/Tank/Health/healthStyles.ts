const styles = {
  healthWrap: {
    position: 'absolute',
    backgroundColor: 'red',
    width: '50px',
    height: '10px',
    zIndex: 5,
    top: '-15px',
    left: '22px'
  },
  health: {
    position: 'relative',
    backgroundColor: 'green',
    height: '10px',
    zIndex: 6,
    transition: 'all 0.5s 0.5s linear',
  }
} as React.CSSProperties 

export default styles