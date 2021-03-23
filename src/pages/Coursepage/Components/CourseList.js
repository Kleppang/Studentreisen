import React, { useState, useContext } from 'react';
import Course from './Course';
import { CourseContext } from './CourseContext';
import '../Styles/courseStyles.css';

const CourseList = () => {
    const [courses, setCourses] = useContext(CourseContext);

    return (
        <div className="course-list">
            {courses.map(course => (
                <Course emnekode={course.emnekode} navn={course.navn} beskrivelse={course.beskrivelse} språk={course.språk} semester={course.semester} studiepoeng={course.studiepoeng} lenke={course.lenke} />
            ))}
        </div>
    );
}

export default CourseList;