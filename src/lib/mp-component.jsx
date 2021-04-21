import React, { Component } from 'react'
import loadLibrary from './load-library'
import classNames from 'classnames'
import styles from './mp-component.css'

const DEFAULT_SKIN = 'amp-default'
const DEFAULT_RATIO = [16, 9]

class AzureMP extends Component {
  constructor(props) {
    super(props)
    this.videoNode = React.createRef()
  }
  destroyPlayer() {
    this.player && this.player.dispose()
  }
  componentWillUnmount() {
    this.destroyPlayer()
  }
  componentDidMount() {
    const { skin } = this.props
    this.initialization = loadLibrary(skin).then(() => {
      this.createPlayer()
      this.setVideo()
    })
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.src !== this.props.src ||
      prevProps.tracks !== this.props.tracks
    ) {
      this.initialization.then(() => this.setVideo())
    }
  }
  setVideo() {
    const { src, tracks } = this.props
    this.player.src(src, tracks)
  }
  createPlayer() {
    const { options, onInstanceCreated } = this.props
    const defaultOptions = {
      controls: true,
      logo: { enabled: false }
    }
    this.player = window.amp(
      this.videoNode.current,
      Object.assign({}, defaultOptions, options)
    )
    onInstanceCreated && onInstanceCreated(this.player)
  }
  getRatioStyles(ratio) {
    if (!ratio) {
      return {}
    }
    return { paddingBottom: (ratio[1] / ratio[0]) * 100 + '%' }
  }
  render() {
    const {
      className,
      skin = DEFAULT_SKIN,
      adaptRatio = DEFAULT_RATIO,
      cornerPlayBtn
    } = this.props
    return (
      <div
        style={this.getRatioStyles(adaptRatio)}
        className={classNames(
          { [styles['azure-mp-container']]: adaptRatio },
          className
        )}>
        <video
          ref={this.videoNode}
          className={classNames('azuremediaplayer', `${skin}-skin`, {
            'amp-big-play-centered': !cornerPlayBtn
          })}
        />
      </div>
    )
  }
}

export default AzureMP
