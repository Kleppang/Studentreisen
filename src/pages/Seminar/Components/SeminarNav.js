// React spesifikt
import React, {useState, useEffect} from "react";
// 3rd-party Packages
import {Tabs, Tab, Typography} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
// Studentreisen-assets og komponenter
import SeminarListUpcoming from './SeminarListUpcoming';
import SeminarListExpired from './SeminarListExpired';
import CookieService from '../../../global/Services/CookieService';


function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div>
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

const SeminarNav = (props) => {
  useEffect(()=>{
    fetchData();

  },[]);


  const [position, setPosition] = useState(0);


  const [seminarsUpcoming, setSeminarsUpcoming] = useState([]);
  const [seminarsExpired, setSeminarsExpired] = useState([]);

  const [enlists, setEnlists] = useState([]);

  const fetchData = () => {
    const token = CookieService.get("authtoken");
      
      const data = {
        token: token
      } 

    axios.all([
      axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarUpcomingData"),
      axios.get(process.env.REACT_APP_APIURL + "/seminar/getAllSeminarExpiredData"),
      axios.post(process.env.REACT_APP_APIURL + "/seminar/getEnlistedSeminars", data),

    ]).then(axios.spread((res1, res2, res3) => {
      setSeminarsUpcoming(res1.data);
      setSeminarsExpired(res2.data);
      setEnlists(res3.data);
    }));
  };


    const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
    const [postsPerPageUpcoming, setPostsPerPageUpcoming] = useState(6);

    const [currentPageExpired, setCurrentPageExpired] = useState(1);
    const [postsPerPageExpired, setPostsPerPageExpired] = useState(6);
    
    //Få nåværende poster
    const indexOfLastPostUpcoming = currentPageUpcoming * postsPerPageUpcoming;
    const indexOfFirstPostUpcoming = indexOfLastPostUpcoming - postsPerPageUpcoming;
    const currentPostsUpcoming = seminarsUpcoming.slice(indexOfFirstPostUpcoming, indexOfLastPostUpcoming);
    const numberOfPagesUpcoming = Math.ceil(seminarsUpcoming.length / postsPerPageUpcoming);
    const intervalUpcoming =  indexOfFirstPostUpcoming + currentPostsUpcoming.length;

    const indexOfLastPostExpired = currentPageExpired * postsPerPageExpired;
    const indexOfFirstPostExpired = indexOfLastPostExpired - postsPerPageExpired;
    const currentPostsExpired = seminarsExpired.slice(indexOfFirstPostExpired, indexOfLastPostExpired);
    const numberOfPagesExpired = Math.ceil(seminarsExpired.length / postsPerPageExpired);
    const intervalExpired =  indexOfFirstPostExpired + currentPostsExpired.length;
      
    const handleChange = (event, newValue) => {
        setPosition(newValue);
    }

    const handlePageUpcoming = (event, value) => {
      setCurrentPageUpcoming(value);
    };

    const handlePageExpired = (event, value) => {
      setCurrentPageExpired(value);
    };

    return (
      <div className="Seminar-Overview">
        <div className="BorderBox">   
          <Tabs value={position} indicatorColor="primary" textColor="primary" onChange={handleChange} centered>
              <Tab className="" label="Kommende" />
              <Tab className="" label="Utgåtte" />
          </Tabs>
        </div>


        <TabPanel value={position} index={0}>
            <div className="Seminar-ContentOverview">
              <SeminarListUpcoming seminarsUpcoming={currentPostsUpcoming} enlists={enlists}/>
            </div>
              <div className="Seminar-indexPosition">
                <div className="Seminar-indexPagination">
                  <div className="Seminar-indexRes2">
                    <Typography  variant="caption" >Viser {indexOfFirstPostUpcoming + 1} - {intervalUpcoming} av {seminarsUpcoming.length} treff</Typography>
                  </div>
                  <Pagination count={numberOfPagesUpcoming} page={currentPageUpcoming} onChange={handlePageUpcoming} />
                </div>
              </div>  
        </TabPanel>

        <TabPanel value={position} index={1}>
            <div className="Seminar-ContentOverview">
              <SeminarListExpired seminarsExpired={currentPostsExpired}/>
            </div>
              <div className="Seminar-indexPosition">
                <div className="Seminar-indexPagination">
                  <div className="Seminar-indexRes2">
                    <Typography  variant="caption" >Viser {indexOfFirstPostExpired + 1} - {intervalExpired} av {seminarsExpired.length} treff</Typography>
                  </div>
                  <Pagination count={numberOfPagesExpired} page={currentPageExpired} onChange={handlePageExpired} />
                </div>
              </div>    
        </TabPanel>
      </div>
    );
};


export default SeminarNav;