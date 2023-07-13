// import React, { Component } from 'react'
// import Newsitem from './Newsitem'

// export default class News extends Component {

//     constructor() {
//         super();
//         this.state = {
//             articles:[],
//             loading: true,
//             page:1
//         }
//     }

//     async componentDidMount() {
//         let url = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=46ad466c62a6499a932493b2f212e9db&pagesize=20";
//         let data = await fetch(url);
//         let parsedData = await data.json()
//         console.log(parsedData);
//        this.setState({articles:parsedData.articles,totalResults:parsedData.totalResults});
//     }

//     handleprevclick= async ()=>{
//         let url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=46ad466c62a6499a932493b2f212e9db&page=${this.state.page-1}&pagesize=20`;
//         let data = await fetch(url);
//         let parsedData = await data.json()
//         console.log(parsedData);
//     //    this.setState({articles:parsedData.articles});

//        this.setState({
//         page:this.state.page-1,
//         articles:parsedData.articles
//        })

//     }

//     handlenextclick= async()=>{
        
//         let url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=46ad466c62a6499a932493b2f212e9db&page=${this.state.page+1}&pagesize=20`;
//         let data = await fetch(url);
//         let parsedData = await data.json()
//         console.log(parsedData);
//     //    this.setState({articles:parsedData.articles});

//        this.setState({
//         page:this.state.page+1,
//         articles:parsedData.articles
//        })
        
//     }

//     render() {
//         return (
//             <div className="container my-3">
//                 <h1 className='text-center'>NeWs_waLLaH-top headlines</h1>
//                 <div className="row">

//                     {this.state.articles.map((element) => {
//                         return <div className="col-md-4" key={element.url}>
//                             <Newsitem title={element.title} description={element.description} imageUrl={element.urlToImage} readmore={element.url} />
//                         </div>
//                     })}

//                 </div>
//                 <div className="container d-flex justify-content-between">

//                      <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handleprevclick}>&larr;Previous</button>

//                      <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/20)} type="button" className="btn btn-dark" onClick={this.handlenextclick}>next &rarr;</button >
//                 </div>
                
//             </div>
//         )
//     }
// }

import React, {useEffect, useState} from 'react'

import NewsItem from './Newsitem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async ()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=46ad466c62a6499a932493b2f212e9db&page=${page}&pageSize=${props.pageSize}`; 
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json()
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NeWs-WaLLaH`;
        updateNews(); 
        // eslint-disable-next-line
    }, [])


    const fetchMoreData = async () => {   
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=46ad466c62a6499a932493b2f212e9db&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1) 
        let data = await fetch(url);
        let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
      };
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                > 
                    <div className="container">
                         
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title } description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>
            </>
        )
    
}


News.defaultProps = {
    country: 'in',
    pageSize: 20,
    category: 'general',
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}
export default News