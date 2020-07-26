import React, { Component } from 'react';
import { getEnv } from '../common/utils';
import { Button } from 'antd';
import styles from './videoPlayer.scss';

export default class VideoPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src: '',
      collectionName: '从基础到实战 手把手带你掌握新版Webpack4.0',
      rate: '1',
    }
  }
  componentDidMount() {
    fetch(`${getEnv()}/files`, {
      method: 'POST'
    }).then(res => res.json()).then(data => {
      this.setState({
        data: data?.data,
        src: data?.data[0],
      });
    })
  }

  renderList() {
    const { data } = this.state;

    return (
      <ul>{data && data.map((item) => {
        return (
          <li
            className={styles['list-item']}
            onClick={() => {
              this.setState({
                src: item
              })
            }}
          ><i className={`iconfont ${styles['player-icon']}`}>&#xe6fa;</i>{item}</li>
        )
      })}
    </ul>
    )
  }

  setRate(rate) {
    const video = document.getElementById('video');
    video && (video.playbackRate = rate);
  }

  render() {
    this.setRate(this.state.rate);
    return (
      <div className={styles['video-player']}>
        <header>
          <div className={styles['return-btn']}>
            <i className={`iconfont ${styles['return-icon']}`}>&#xe677;</i>
            <span className={styles['homepage-text']}>首页</span>
          </div>
          <div className={styles['collection-name']}>
            <span>{this.state.collectionName}</span>
          </div>
        </header>
        <div className={styles['container']}>
          <div className={styles['sidebar-container']}>
            <div className={styles['is-playing']}>
              <div>正在播放</div>
              <div>{this.state.src}</div>
            </div>
            {this.renderList()}
          </div>
          <div className={styles['content-container']}>
            <video id="video" className={styles['abc']} src={'./videos/' + this.state.src} controls width="900px" />
            <div className={styles['rate-control']}>
              <Button onClick={() => {
                this.setState({
                  rate: '1'
                });
              }}>1倍速</Button>
              <Button onClick={() => {
                this.setState({
                  rate: '1.5'
                })
              }}>1.5倍速</Button>
              <Button onClick={() => {
                this.setState({
                  rate: '1.75'
                })
              }}>1.75倍速</Button>
              <Button onClick={() => {
                this.setState({
                  rate: '2'
                })
              }}>2倍速</Button>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}