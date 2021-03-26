import { useState, useEffect, useContext, Component} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import { MyCardContent } from '../Styles/apistyles';

import axios from 'axios';
import Box from '@material-ui/core/Box';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import LanguageIcon from '@material-ui/icons/Language';
import SchoolIcon from '@material-ui/icons/School';
import Button from '@material-ui/core/Button';




// Studentreisen-assets og komponenter
import '../Styles/courseStyles.css';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CookieService from '../../../global/Services/CookieService';
import AuthService from '../../../global/Services/AuthService';


const CourseDetail = () => {

    useEffect(() => {
        fetchData();
    },[]);

    let { emnekode } = useParams();
    const [courses, setCourses] = useState([]);

    const fetchData = async () => {
                    
        const res = await axios.get(process.env.REACT_APP_APIURL + "/course/");
        console.log(res.data);
        setCourses(res.data);

    };
        return(
            <div className="course-detail">
            {courses.map(course => { if(emnekode === course.emnekode)           
                    return <Box className="box-detail" boxShadow={3}>
                                <MyCardContent>
                                    <div className="courseHeader">
                                        <p className="kursnavn">{course.navn}</p>
                                        <div className="kursinfo-tekst">
                                            <p>{course.emnekode}</p>
                                            <div className="iconBox">
                                                <LanguageIcon className="language-icon" fontSize="inherit"/>
                                                <p className="undervisningsspråk">{course.språk}</p>
                                            </div>
                                            <div className="iconBox">
                                                <CalendarTodayIcon className="language-icon2" fontSize="inherit"/>
                                                <p>{course.semester}</p>
                                            </div>
                                            <div className="iconBox">
                                                <SchoolIcon className="language-icon2" fontSize="inherit"/>
                                                <p>{course.studiepoeng}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="courseBody">
                                        <h3>Sammendrag</h3>
                                        <p>{course.beskrivelse}</p>
                                    </div>
                                    <Button variant="outlined" color="primary" className="courseButton" href={course.lenke}>Gå til kursets hjemmeside</Button>

                                </MyCardContent>
                            </Box>
                        
            })}
            </div>
        );

};

export default CourseDetail;



