const styles = theme => {
  return (
    {
      slide: {
        transition: "transform",
        transitionDuration: 200,
        transitionTimingFunction: "ease-in-out",
        top: "2rem",
        position: "absolute",
        flexWrap: "nowrap"
      },
      normalText: {
        textTransform: "none"
      },
      left: {
        justifyContent: "flex-start"
      },
      leftOpen: {
        transform: "translateX(-100%)"
      },
      leftClose: {
        transform: "translateX(-2.4rem)"
      },
      right: {
        justifyContent: "flex-end"
      },
      rightOpen: {
        transform: "translateX(100%)"
      },
      rightClose: {
        transform: "translateX(2.4rem)"
      }
    }
  )
}
export default styles;