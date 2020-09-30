import React, { Component } from 'react';
import styles from './index.scss';
import { getEnv } from '../../common/utils';
import img from '../../images/wenjianjia.jpg'

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collections: []
    }
  }
  componentDidMount() {
    fetch(`${getEnv()}/api/getCollections`, {
      method: 'POST'
    }).then(res => res.json()).then((data) => {
      this.setState({
        collections: data.data,
      })
    })
  }
  render() {
    const { collections } = this.state; 
    return (
      <div className={styles['home-page']}>
        <div className={styles['page-content']}>
          <h2>课程列表：</h2>
          <div className={styles['collection-list']}>
            {
              collections.map((collection) => {
                return (<a
                  href={`#/video?name=${collection}`}
                  className={styles['collection-link']}
                >
                  <img src={img} width="50" />
                  <div>{collection}</div>
                </a>)
              })
            }
          </div>
        </div>
      </div>
    )
  }
}