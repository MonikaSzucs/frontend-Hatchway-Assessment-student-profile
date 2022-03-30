import React, { useState, useEffect } from "react";
import useCollapse from 'react-collapsed';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function Home() {
    // https://storage.googleapis.com/hatchways-app.appspot.com/assessments/data/frontend/f-1/735fae21-9b8d-4431-8978-5098a2217fd2/part2.webm

    const url =`https://api.hatchways.io/assessment/students`

    const axios = require('axios').default;
    const [eventsData, setEventsData] = useState({});
    const studentValues = []
    const studentPercentageValues = []

    const [searchTerm, setSearchTerm] = useState('')
    const [searchTag, setSearchTag] = useState('')

    

    const getGiHubUserWithAxios = async () => {
        const response = await axios.get(url);
        console.log(response.data)
        setEventsData(response.data);
        
        for (var i = 0; i < response.data.students.length; i++) {
            var total = 0
            const studentData = {}
            for (var j = 0; j < response.data.students[i].grades.length; j++) { 
                total += parseInt(response.data.students[i].grades[j])
            }
            studentData.gradeTotal = total;
            studentData.marksLength = response.data.students[i].grades.length;
            studentValues.push(studentData)
        }
        console.log(studentValues)
        for (var k = 0; k < studentValues.length; k++){
            const studentPercentage = {}
            console.log(studentValues[k].gradeTotal)
            console.log(studentValues[k].marksLength)
            studentPercentage.percentage = studentValues[k].gradeTotal / studentValues[k].marksLength
            studentPercentageValues.push(studentPercentage)
        }
        console.log(studentPercentageValues)
    };

    useEffect(() => {
        console.log("useEffect on Events Page")
        getGiHubUserWithAxios();
    },[])

    const [ isExpanded, setExpanded ] = useState(false);
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
    function handleOnClick() {
        // Do more stuff with the click event!
        // Or, set isExpanded conditionally 
        setExpanded(!isExpanded);
    }



    const [clicked, setClicked] = useState(false);

    const toggle = indexKey => {
        if (clicked === indexKey) {
        //if clicked question is already active, then close it
        return setClicked(null);
        }

        setClicked(indexKey);
    };



    const [tags, setTags] = useState([]);
    const addTag = (e) => {
        if (e.key === "Enter") {
        if (e.target.value.length > 0) {
            setTags([...tags, e.target.value]);
            e.target.value = "";
        }
        }
    };
    const removeTag = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
    };

    return (
        <>
        <div className="grid place-items-center h-screen">
            <div className=""></div>
            <div className="w-3/5 h-2/3 flex max-h-screen overflow-y-auto flex-col flex-grow bg-white scrollbar-thin scrollbar-thumb-white-700 scrollbar-track-white-300 rounded-lg shadow-md">
            
            {/* Search By Name */}
            <input className="border-b-2 p-2" 
                type="text" 
                name="name" 
                placeholder="Search by name" 
                onChange={event => {setSearchTerm(event.target.value)}}
            />

            {/* Search By Tag */}
            {/* <input className="border-b-2 p-2" 
                type="text" 
                name="tag" 
                placeholder="Search by tag" 
                onChange={event => {setSearchTag(event.target.value)}}
            /> */}
            {   
                // Filter to search by first or last name
                eventsData.students?.filter((student) => {
                    if (searchTerm == ""){
                        return student
                    } else if (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
                    ){
                        return student
                    }
                }).map((student, indexKey) => {
                    // Start grabbing information of each student
                    return (
                        
                        <div className="grid grid-cols-5 border-b-2 border-gray-300" key={indexKey}>
                                <div className="col-span-1 flex pt-4 justify-center">
                                    <img className="border rounded-full h-28" src={student.pic} alt="new"/>
                                </div>
                                <div className="col-span-3 py-2">
                                    <h2 className="text-2xl font-bold pb-2 uppercase">{student.firstName} {student.lastName}</h2>
                                    <div className="pl-4">
                                        <p className="">Email: {student.email}</p>
                                        <p className="">Company: {student.company}</p>
                                        <p className="">Skill: {student.skill}</p>
                                        <p className="">Average: 
                                            {/* Calculate the average by adding all the test scores then dividing by the number of test scores */}
                                            {student.grades.reduce((total, amount) => 
                                                ((parseFloat(total) + parseFloat(amount)) / (student.grades.length/4)).toFixed(3))
                                            }%
                                        </p>
                                        
                                        {/* {tags.map((tag, index) => {
                                            return (
                                                <span key={index} className="tag mr-2 p-1 rounded bg-gray-200" onClick={() => removeTag(tag)}>
                                                    {tag}
                                                </span>
                                            );
                                        })}
                                        <div>
                                            <input  className="border-b-2" 
                                                    onKeyDown={addTag} 
                                                    type="text" 
                                                    name="tag" 
                                                    placeholder="Add a Tag"
                                            />
                                        </div> */}
                                    </div>
                                    <div>
                                    {clicked === indexKey ? (
                                        <div className="content">
                                            {student.grades?.map((sourceItems, sIndex) => {
                                            return (
                                                <div key={sIndex}>
                                                    <table >
                                                        <tr>
                                                            <td className="pr-6">Test {sIndex+1}:</td>
                                                            <td>{sourceItems}%</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            )})}
                                        </div>
                                    ) : null}
                                    </div>
                                </div >
                                <div col-span-1>
                                    <div className="collapsible">
                                        <div className="header text-6xl justify-items-end justify-end pr-4 text-gray-400" onClick={() => toggle(indexKey)} key={indexKey}>
                                            <div className="FiMinusPlus"style={{float: "right"}}>{clicked === indexKey ? <FiMinus/> : <FiPlus/>}</div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    )
                })
            }
            </div>
            <div className=""></div>
        </div>
        </>
    );
}
// Home