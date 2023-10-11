import React,{useEffect, useState} from 'react';
import './index.css';
//import 'antd/dist/antd.css';
import { Table,Space,Button,Typography, Pagination,Progress, Tree,TreeSelect,Col ,Tooltip, Image, Tag, ConfigProvider, Dropdown, Menu, Skeleton, Row,Input, Select } from 'antd';
import { CheckOutlined,CloseOutlined, CaretUpOutlined, CaretDownOutlined, PlusOutlined,SearchOutlined } from '@ant-design/icons';
import calendar_img from "./Images/calendar.png"
import Checkin_img from "./Images/Checkin.png"
import current_kr_img from "./Images/current_kr.png"
import current_obj_img from "./Images/current_obj.png"
import edit_img from "./Images/edit.png"
import goals_img from "./Images/goals.png"
import more_img from "./Images/more.png"
import parent_kr_img from "./Images/parent_kr.png"
//import {Loadskeleton} from "./loading"
import parent_obj_img from "./Images/parent_obj.png"
import trend_img from "./Images/trend.png"
import userimg_img from "./Images/userimg.png"
import { ReactComponent as EmptyState} from  './Images/emptystate.svg'
import {ReactComponent as newOKR} from './Images/addOKR.svg'
import goals from './Images/goals.png'
import keyresultsIcon from './Images/current_kr.png'
import FilterComponent from './filter.js';


const searchDelay = 500; 
const {Text, Title } = Typography;
const { TreeNode } = Tree;




const MyFunction = () => {

let kf = window.kf
const [type, setType] = useState('primary');
const [advtype, advsetType] = useState('default');
const [apiResponse, setApiResponse] = useState()
const [countapiResponse, setCountApiResponse] = useState()
const [page,setPage]=useState(1)
const [count, setCount] = useState()
const [ObjectiveIDs, setObjectiveIDs] = useState()
const [ObjectiveNames, setObjectiveNames] = useState()
const [startDates, setStartDates]= useState()
const [dueDates, setDueDates] = useState()
const [TimeFrames, setTimeFrames] = useState()
const [AverageProgression,setAverageProgression] = useState()
const [keyResultsData, setKeyResultsData] = useState([]);
const [expended, setExpended] = useState()
const [OKRStatuses, setOKRStatuses] = useState()
const [expandedRows, setExpandedRows] = useState({});
const [LinkedObjectiveCounts, setLinkedObjectiveCounts] = useState({});
const [loading, setLoading] = useState(true);
const [emptyicon, setemptyicon] = useState('none');
const [filterText, setFilterText] = useState("");
const [WatchparamReportID,setWatchparamReportID] = useState()
const [OnOKRSave,setOnOKRSave] = useState()
const [currentPageID,setcurrentPageID] = useState()
const [currentUser,setcurentUser] = useState()
const [objectiveOwners,setObjectiveOwners]= useState()
const [TeamName,setTeamName] = useState()
const [OKRStatuse, setOKRstatuse]= useState()
const [ObjectiveOwnerNames,setObjectiveOwnerNames]= useState()
const [watchParamOKRStatus,setwatchParamOKRStatus]= useState()
const [expandedRowKeys, setExpandedRowKeys] = useState([]);
const [accountId,setAccountId]=useState([]) // Declare expandedRowKeys state
const [dataformId, setDataFromId] = useState([]);
const [LnkdObjRptId, setLnkdObjRptId] = useState()
const [applicationId,setApplicationId] = useState()
const [RoleName,setRoleName] = useState()
const [searchQuery, setSearchQuery] = useState('');
const [searchTimeout, setSearchTimeout] = useState(null);

//const [emptyicon, setemptyicon] = useState('none');

const ReportApiCall = async(page, WatchparamReportID, query) =>{
  let kf = window.kf
  setcurrentPageID(kf.app.page._id)
  kf.app.setVariable("OKR_status", "default") //setting it to default value to use in watch params
let data_form_id = await kf.app.getVariable("data_form_id");
let data_form_name = "Objective Master"
let  currentRole = kf.user.Role.Name
setRoleName(kf.user.Role.Name)
console.log("Role " ,kf.user.Role.Name);
setDataFromId(data_form_id)
  setcurentUser(kf.user.Email)
  if (query) {
    console.log('Search query from filter : ' + query);
    setSearchQuery(query);
  } else {
    console.log('No Search query from filter');
  }
  const queryString = searchQuery ? `&q=${searchQuery}` : '';

    //const applicationResponse = await kf.api('/id');
    const application_id = kf.app._id;
    const account_id  = kf.account._id;
    let linkedObjectiveReportId= await kf.app.getVariable("linked_objectives_Name_report_id")
    setLnkdObjRptId(linkedObjectiveReportId)
    let report_id = await kf.app.getVariable("report_id");
    console.log('data_form_id before',data_form_id);
    setAccountId(account_id)
    setApplicationId(application_id)
    // if (!data_form_id) {
    //   await kf.api("/flow/2/" + account_id + "/form/?_application_id=" + application_id).then(async (form_report) => {
    //     let data_form_info = form_report.find(itm => itm.Name === data_form_name);
    //     data_form_id = data_form_info._id;
    // console.log('data_form_id',data_form_id);
    //     kf.app.setVariable("data_form_id", data_form_id);
    //   })}
console.log('data_form_id',data_form_id);
console.log('report_id', report_id);

  try{
    if(currentPageID == 'Copy_Team_OKR_Page_A00' ||currentPageID == 'Team_OKR_Page_A01'){
      let tabName = await kf.app.getVariable("Team_OKR_Team_Name")
      let counturl = `/form-report/2/${account_id}/${data_form_id}/${report_id}/count?$team_name=${TeamName}`
    let url = `/form-report/2/${account_id}/${data_form_id}/${report_id}?_application_id=${application_id}&$team_name=${TeamName}&page_number=${page}&page_size=${5}${queryString}`
    let countapiresponse = await window.kf.api(counturl)
    let apiresponse = await window.kf.api(url)
    setLoading(false)
    setemptyicon('block');
    return {countapiresponse,apiresponse}
    }else if (currentPageID =='role_executive_api_customisation_A00'){
      let counturl = `/form-report/2/${account_id}/${data_form_id}/${report_id}/count?$objective_owner_email=${currentUser}`
      let url = `/form-report/2/${account_id}/${data_form_id}/${report_id}?_application_id=${application_id}&$objective_owner_email=${currentUser}&page_number=${page}&page_size=${5}${queryString}`
      let countapiresponse = await window.kf.api(counturl)
      let apiresponse = await window.kf.api(url)
      setLoading(false)
      setemptyicon('block');
      return {countapiresponse,apiresponse}
      }
    else if (currentPageID =='Company_OKR_page_A00'){
    let counturl = `/form-report/2/${account_id}/${data_form_id}/${report_id}/count`
    let url = `/form-report/2/${account_id}/${data_form_id}/${report_id}?_application_id=${application_id}&page_number=${page}&page_size=${5}${queryString}`
    let countapiresponse = await window.kf.api(counturl)
    let apiresponse = await window.kf.api(url)
    setLoading(false)
    setemptyicon('block');
    return {countapiresponse,apiresponse}
    }
    
        }catch (error){
          console.error('Error fecthing the data', error);
          setLoading(false)
          setemptyicon('block');
          return null
        }
}
const handleStatusChangeToComplete = async(record) =>{

  // Overall_Progress_A00
  // OKR_Status

  let overallProgress = await kf.api(`/form/2/${accountId}/Overall_Progress_A00?page_number=1&page_size=1000`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "Name": record._id,
      OKR_Status:"Completed"
    })
  });
  let resp = await kf.api(`/form/2/${accountId}/${dataformId}?page_number=1&page_size=1000`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "Name": record._id,
      OKR_Status:"Completed"
    })
  });
   kf.app.setVariable("OKR_status", "Completed")
}
const handleStatusChangeToDropped = async(record)=>{
  let kf = window.kf
  

  console.log("Change status to Dropped");
  let resp = await kf.api(`/form/2/${accountId}/${dataformId}?page_number=1&page_size=1000`, 
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "Name": record._id,
      OKR_Status:"Dropped"
    })
  });
   kf.app.setVariable("OKR_status", "Dropped")
}
const handleClosedClick = async(record) => {
  console.log('closed', record);
  kf.client.showConfirm({
    title: 'Confirm Completion',
    content: 'Are you sure you want to mark this objective as completed?',
    //okText:"Ok",
    //maskClosable: true,
    // OK: () => {
    //   console.log("Clicked On OKR");
    //   handleStatusChangeToCompleted(row['_id'], row[col_Objective_ID], 'Completed');
    // },
  }).then((res)=>{if(res === "OK"){
    console.log(res,'showconfirm promise')
    console.log("Clicked On OKR");
   handleStatusChangeToComplete(record)
    //kf.client.showInfo(`${recor} moved to Complete`);    
  }
      else{
        console.log("Clicked on cancel");
      }
  }).catch((err)=>{
    console.log(err,'confirm error callback')
  });
};

// Define a function to handle the "dropped" action
const handleDroppedClick = async(record) => {
  console.log('dropped', record);
  kf.client.showConfirm({
    title: 'Confirm Drop',
    content: 'Are you sure you want to mark this objective as Dropped?',
    //okText:"Ok",
    //maskClosable: true,
    // OK: () => {
    //   console.log("Clicked On OKR");
    //   handleStatusChangeToCompleted(row['_id'], row[col_Objective_ID], 'Completed');
    // },
  }).then((res)=>{if(res === "OK"){
    console.log(res,'showconfirm promise')
    console.log("Clicked On OKR");
      handleStatusChangeToDropped(record);}
      else{
        console.log("Clicked on cancel");
      }
  }).catch((err)=>{
    console.log(err,'confirm error callback')
  });
};
useEffect(() => {
  kf.context.watchParams(async function (watch) {
    const tabName = watch.TAB_NAME;
    const teamName = watch.Team_Change_Tree_View;
    const reportId = watch.report_id;
    const on_okr_save = watch.on_okr_save;
    const OKR_status = watch.OKR_status;

console.log(watch);
    console.log("tabName ",tabName)
    console.log("teamName ", teamName);
    console.log("reportId ", reportId);
    console.log("on_okr_save ",on_okr_save);

    setWatchparamReportID(reportId);
    setOnOKRSave(on_okr_save)
    setTeamName(teamName)
    setwatchParamOKRStatus(OKR_status);

  });
}, []);

useEffect(()=>{


    const fetchData = async() =>{
      try{
        const {apiresponse, countapiresponse} = await ReportApiCall(page)
        console.log('WatchparamReportID',WatchparamReportID);
        console.log('apiresp: ',apiresponse);
        console.log('count api response is ',countapiresponse.Count);

        // const updatedApiResponse = apiresponse.Data.map((o) => ({
        //   ...o,
        //   key: `${o._id}`
        // }))
        console.log('updatedApiResponse: ',apiresponse);
        setApiResponse(apiresponse)
        setCountApiResponse(countapiresponse)
        setCount(countapiresponse.Count)

    const ObjectiveIDs = apiresponse.Columns.find(col => col.FieldId === 'Objective_ID').Id
    const ObjectiveName =apiresponse.Columns.find(col => col.FieldId === 'Objective_Name').Id
    const StartDate = apiresponse.Columns.find(col => col.FieldId === 'Start_Date').Id
    const DueDate = apiresponse.Columns.find(col => col.FieldId === 'Due_Date_2').Id
    const TimeFrame = apiresponse.Columns.find(col => col.FieldId === 'Timeframe_text').Id
    const AverageProgress = apiresponse.Columns.find(col => col.FieldId === 'Average_Progress').Id
    const OKRStatus = apiresponse.Columns.find(col => col.FieldId === 'Status_Marker_text').Id
    const ObjectiveOwners = apiresponse.Columns.find(col => col.FieldId === 'Objective_Owner_Email').Id
    const OKRstatus = apiresponse.Columns.find(col => col.FieldId === 'OKR_Status_1').Id
    const ObjectiveOwnerNames = apiresponse.Columns.find(col => col.FieldId === 'Objective_Owner_Name').Id
    setObjectiveOwnerNames(ObjectiveOwnerNames)
    setOKRstatuse(OKRstatus)
    setObjectiveOwners(ObjectiveOwners)
    setObjectiveIDs(ObjectiveIDs)
    setObjectiveNames(ObjectiveName)
    setDueDates(DueDate)
    setStartDates(StartDate)
    setTimeFrames(TimeFrame)
    setAverageProgression(AverageProgress)
    setOKRStatuses(OKRStatus)
    
    setExpandedRowKeys([]);

} catch (error){
  console.error('An error occoured in the use effect: ',error);
}

}

fetchData()
    
return ()=>{}
},[page,WatchparamReportID, OnOKRSave,TeamName,watchParamOKRStatus,searchQuery])


// setTimeout(() => {
//   setLoading(false);
//   console.info("in timeout");
// }, 300);
const handlePageChange = (page) => {
  console.log('Pagination change to page:', page);
  setPage(page);
  setLoading(true);
  ReportApiCall(page, searchQuery);
};
const handleSearch = (query) => {
  console.log('Search from filter:', query);
  setSearchQuery(query);
  setPage(1);
  setLoading(true);

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  setSearchTimeout(
    setTimeout(() => {
      ReportApiCall(1, query);
    }, searchDelay)
  );
};
const columns = [
    {
      title: 'Objective ID',
      dataIndex: ObjectiveNames,
      key: 'ObjectiveIDs',
      width:'23%',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
      return {
        props:{
          //className:"bg-red",
          className: "OKRClassName",   // there it is!
        },
         children:
          <> <Image   preview={false} width={20} height={20} style={{position:'relative',top:'0px'}} src={current_obj_img}/>&nbsp;&nbsp;
          <Tooltip   placement="topLeft" title={text}> <Text   style={{fontSize: "12px",fontFamily: "Inter",fontWeight:"600"}}  
      >{text}</Text></Tooltip> </>,
    
  } 
}
  
    },
  //   {
  //     title: 'Objective Name',
  //     dataIndex: ObjectiveNames,
  //     key: ObjectiveNames,
  //     ellipsis:{
  //       showTitle:false,
  //     },
  //     render: (text, record) => 
        
  //         <a>
  //         <Tooltip   placement="topLeft" title={text}> <Text   style={{fontSize: "12px",fontFamily: "Inter",fontWeight:"600"}}  
  //     >{text}</Text></Tooltip> </a>,
    
  // },
  {
    title: 'Objective Timeperiod',
    dataIndex: 'Objective_ID',
    width:'22%', // Assuming you want to use 'Objective_ID' as the key
    ellipsis: {
      showTitle: false,
    },
    render: (text, record) => {
      const startDate = record[startDates];
      const dueDate = record[dueDates];
      
      // Assuming startDate and dueDate are in the format 'YYYY-MM-DD'
      const formattedStartDate = `${new Date(startDate).toLocaleString('default', { month: 'short' })}-${new Date(startDate).getFullYear()}`;
      const formattedDueDate = `${new Date(dueDate).toLocaleString('default', { month: 'short' })}-${new Date(dueDate).getFullYear()}`;
  
      const timeFrame = `${record[TimeFrames]} (${formattedStartDate} - ${formattedDueDate})`;
      
      return {
        props: {
          className: "OKRClassName",
        },
        children: (
          <>
            <Image preview={false} width={20} height={20} src={calendar_img} />&nbsp;&nbsp;
            <Tooltip placement="topLeft" title={timeFrame}>
              {timeFrame}
            </Tooltip>
          </>
        ),
      };
    },
    responsive: ['md'],
  },
  {
    title: 'progress',
    //dataIndex: 'progress',
    width:'150px',
    key: 'progress',
    render: (text,record) => <> <div style={{ width: 120 ,marginTop:"2px", fontSize: "12px",fontFamily: "Inter",fontWeight: "400", color: "#080E19"}}>
      <Progress strokeColor="#4AA147" percent={record[AverageProgression]}  /></div> </>,
    responsive: ['md'],
     
  },
  {
    title: 'status',
    dataIndex: OKRStatuses,
    width:'100px',
    key: 'status',
    render: (text) => {if (text ==='At Risk'){
      return(
      <> <Tag style={{size:"45px",color:"black", marginTop:"2px",borderRadius:"25px",fontSize: "12px",fontFamily: "Inter",fontWeight: "600", color: "#292B2F"}} color="#D8DCE5">{text}</Tag> </>)
    }else if (text ==='Not Started'){
      return (
        <> <Tag style={{size:"45px",color:"black", marginTop:"2px",borderRadius:"25px",fontSize: "12px",fontFamily: "Inter",fontWeight: "600", color: "#61656C"}} color="#D8DCE5">{text}</Tag> </>
      )
    }
    else if (text ==='On Track'){
      return (
        <> <Tag style={{size:"45px",color:"black", marginTop:"2px",borderRadius:"25px",fontSize: "12px",fontFamily: "Inter",fontWeight: "600", color: "#1D281D"}} color="#D9EED8">{text}</Tag> </>
      )
    }
    else if (text ==='Behind'){
      return (
        <> <Tag style={{size:"45px",color:"black", marginTop:"2px",borderRadius:"25px",fontSize: "12px",fontFamily: "Inter",fontWeight: "600", color: "#520F0E"}} color="#F9DAD9">{text}</Tag> </>
      )
    }else if (text ==='Completed'){
      return (
        <> <Tag style={{size:"45px",color:"black", marginTop:"2px",borderRadius:"25px",fontSize: "12px",fontFamily: "Inter",fontWeight: "600", color: "#1D281D"}} color="#D9EED8">{text}</Tag> </>
      )
    }else if (text ==='Dropped'){
      return (
        <> <Tag style={{size:"45px",color:"black", marginTop:"2px",borderRadius:"25px",fontSize: "12px",fontFamily: "Inter",fontWeight: "600", color: "#27279E"}} color="#E2E2F8">{text}</Tag> </>
      )
    }
    },
    responsive: ['md'],
    
  },
  {
    title: 'assigned to',
    dataIndex: ObjectiveOwnerNames,
    width:'110px',
    key: 'assignedto',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => <><Image preview={false} width={20} height={20}  src={userimg_img}/>&nbsp;&nbsp;
    <Tooltip placement="topLeft" title={text}>
      <Text style={{fontSize: "12px",fontFamily: "Inter",fontWeight: "400", color: "#080E19"}}>{text}</Text></Tooltip></>,
    responsive: ['md'],
  

  },

    {
      title: 'Actions',
      key: 'actions',
       
      render: (record) => (
        <div style={{ position: 'relative', display:'flex',alignItems:'start',justifyContent:'flex-start' }}>
          {RoleName === 'Admin' ? ( 
              <Tooltip title="Check in">
             <Button type="link" shape="circle" onClick={() => handleCheckin(record)}>
            <Image preview={false} width={29} height={24} src={Checkin_img} />
                </Button>
              </Tooltip>
          ):  record[objectiveOwners] === currentUser && ['Not Started', 'On Track', 'Behind', 'At Risk'].includes(record[OKRStatuses]) ? (
<Tooltip title="Check in">
             <Button type="link" shape="circle" onClick={() => handleCheckin(record)}>
            <Image preview={false} width={29} height={24} src={Checkin_img} />
                </Button>
              </Tooltip>
          ):null}
          
{RoleName === 'Admin' ? (
  // Display the button when RoleName is 'Admin'
  <Tooltip title="Edit">
    <Button type="link" shape="circle" onClick={() => handleEdit(record)}>
      <Image preview={false} width={29} height={24} src={edit_img} />
    </Button>
  </Tooltip>
) : record[objectiveOwners] === currentUser && ['Not Started', 'On Track', 'Behind', 'At Risk'].includes(record[OKRStatuses]) ? (
  // Display the button when the second condition is met
  <Tooltip title="Edit">
    <Button type="link" shape="circle" onClick={() => handleEdit(record)}>
      <Image preview={false} width={29} height={24} src={edit_img} />
    </Button>
  </Tooltip>
) : null}

          
          
          <Tooltip title="Trend">
            <Button type="link" shape="circle" onClick={()=>handleTrends(record)}>
              <Image preview={false} width={29} height={24} src={trend_img} />
            </Button>
          </Tooltip>
          
          {RoleName === 'Admin' ? (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => handleClosedClick(record)}>Mark as Completed</Menu.Item>
          <Menu.Item key="2" onClick={() => handleDroppedClick(record)}>Mark as Dropped</Menu.Item>
        
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="link" shape="circle">
              <Image preview={false} width={29} height={24} src={more_img} />
            </Button>
          </Dropdown>
          ):record[objectiveOwners] === currentUser && ['Not Started', 'On Track', 'Behind', 'At Risk'].includes(record[OKRStatuses]) ? (
            <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => handleClosedClick(record)}>Mark as Completed</Menu.Item>
          <Menu.Item key="2" onClick={() => handleDroppedClick(record)}>Mark as Dropped</Menu.Item>
        
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="link" shape="circle">
              <Image preview={false} width={29} height={24} src={more_img} />
            </Button>
          </Dropdown>
          ):null
        }
        </div>
      ),
      
      
    },
  ];



const ShowActive = async() => {
  setType("primary");
  advsetType("default");
  console.log('currentPageID',currentPageID);
  if(currentPageID ==="role_executive_api_customisation_A00"){
   kf.app.setVariable("report_id", "Completed_manager_OKR_report_A00");
}else if(currentPageID === "Copy_Team_OKR_Page_A00"){
  console.log('setting report to','Team_OKRs_A00');
   kf.app.setVariable("report_id", "Team_OKRs_A00");
}else if(currentPageID === "Company_OKR_page_A00"){
   kf.app.setVariable("report_id", "Company_OKRs_A00");
} 
};
const ShowComplete = async () => {
  setType("default");
  advsetType("primary");
  console.log('currentPageID',currentPageID);
  if(currentPageID ==="role_executive_api_customisation_A00"){
     kf.app.setVariable("report_id", "Manager_Completed_OKRs_A00");
  }else if(currentPageID === "Copy_Team_OKR_Page_A00"){
    console.log('setting report to','Team_OKR_Closed_A00');

     kf.app.setVariable("report_id", "Team_OKR_Closed_A00");
  }else if(currentPageID === "Company_OKR_page_A00"){
     kf.app.setVariable("report_id", "Company_OKRs_Closed_A00");
  } 
};

const handleCheckin = async(record)=>{
  let kf = window.kf;
  
  let currentDate = new Date();
  let startDay = currentDate.getDate();
    let startMonth = currentDate.toLocaleString('default', { month: 'short' });
  let startYear = currentDate.getFullYear().toString().substr(-2);
  let formattedStartDate = startDay + "_"+ startMonth + "_" + startYear; 

let resp_get_progress = await kf.api(`/form/2/${accountId}/${dataformId}/${record._id}?_application_id=${applicationId}`,
  {
    method: "GET", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    }
  })


let resp = await kf.api(`/form/2/${accountId}/${dataformId}?page_number=1&page_size=1000`,



  {
    method: "PUT", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      "Name": record._id,
      Checkin_visiblity: "Yes",
      OKR_Status: record[OKRStatuse] === 'New' ? "InProgress" : record[OKRStatuse]
    })
  })
  if (currentPageID === 'Company_OKR_page_A00') {
    kf.app.page.openPopup("Popup_rGXjfqqw2", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'Copy_Team_OKR_Page_A00') {
    kf.app.page.openPopup("Popup_rGXjfqqw2", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'role_executive_api_customisation_A00') {
    await kf.app.page.openPopup("Popup_rGXjfqqw2", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'Admin_OKR_Page_A00') {
    await kf.app.page.openPopup("Popup_rGXjfqqw2", {

      instance_id: record._id,

    });
  }

}
const expend = (index) => {
  if (expended === index) setExpended(undefined);
  else setExpended(index);
};
const handleEdit=async(record)=>{
  let kf = window.kf;
  let account_id=kf.account._id;
  //handleCollapse(record);


  let resp = await kf.api(`/form/2/${account_id}/${dataformId}?page_number=1&page_size=1000`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "Name": record._id,
      Checkin_visiblity: "No",
      // Is_field_to_be_visible: "Yes",
      Is_OKR_section_to_be_visible: currentPageID === "role_executive_api_customisation_A00" || currentPageID === "Copy_Team_OKR_Page_A00" ? "Yes" : undefined,
      Is_Key_Result_Column_to_be_visible: currentPageID === "role_executive_api_customisation_A00" || currentPageID === "Copy_Team_OKR_Page_A00" ? "Yes" : undefined,
      Is_Team_Name_to_be_visbile: currentPageID === "role_executive_api_customisation_A00" || currentPageID === "Copy_Team_OKR_Page_A00" ? "Yes" : undefined
    })
  });

  
  if (currentPageID === 'Company_OKR_page_A00') {
    let kf = window.kf;
    kf.app.page.openPopup("Popup_rGXjfqqw2", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'Copy_Team_OKR_Page_A00') {
    let kf = window.kf;
    await kf.app.page.openPopup("Popup_rGXjfqqw2", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'role_executive_api_customisation_A00') {
    let kf = window.kf;
    await kf.app.page.openPopup("Popup_rGXjfqqw2", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'Admin_OKR_Page_A00') {
    await kf.app.page.openPopup("Popup_rGXjfqqw2", {

      instance_id: record._id,

    });
  }
  
}
const handleTrends = async(record)=>{
  if (currentPageID === 'Company_OKR_page_A00') {
    await kf.app.page.openPopup("Popup_hMXhGIzx7", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'Copy_Team_OKR_Page_A00') {
    await kf.app.page.openPopup("Popup_hMXhGIzx7", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'role_executive_api_customisation_A00') {
    await kf.app.page.openPopup("Popup_hMXhGIzx7", {

      instance_id: record._id,

    });
  }
  else if (currentPageID === 'Admin_OKR_Page_A00') {
    await kf.app.page.openPopup("Popup_hMXhGIzx7", {

      instance_id: record._id,

    });
  }
}
const handleCollapse = (record) => {
  // Remove the data for the collapsed row from expandedRows state
  setExpandedRows((prevRows) => {
    const newExpandedRows = { ...prevRows };
    delete newExpandedRows[record._id];
    
    return newExpandedRows;
  });
};

const AddNewOKR = async(record) => {
 console.log('add new okr', record);
  let account_id=kf.account._id;

var response;

let TEAM_NAME = await  kf.app.getVariable("Team_OKR_Team_Name");

console.log(TEAM_NAME)
if (currentPageID==='Copy_Team_OKR_Page_A00'){

if(kf.user.Role.Name !="Executive")

 response = await kf.api("/form/2/"+account_id+"/"+dataformId, {

  method: "POST",

  headers: {"Content-Type": "application/json"},

  body: JSON.stringify({"Is_this_Company":"No","Is_OKR_section_to_be_visible":"Yes","Is_Key_Result_Column_to_be_visible" : "Yes","Is_Team_Name_to_be_visbile":"Yes","Is_Key_result_table_to_be_visible":"Yes","Role":kf.user.Role.Name,"Team_Name_OKR":TEAM_NAME })});


if(kf.user.Role.Name =="Executive")

 response = await kf.api("/form/2/"+account_id+"/"+dataformId, {

  method: "POST",

  headers: {"Content-Type": "application/json"},

  body: JSON.stringify({"Is_this_Company":"No","Is_OKR_section_to_be_visible":"Yes","Is_Key_Result_Column_to_be_visible" : "Yes","Is_Team_Name_to_be_visbile":"Yes","Is_Key_result_table_to_be_visible":"Yes","Role":kf.user.Role.Name,"Approved_By_email":"Executive","Team_Name_OKR":TEAM_NAME})

});

let instance_id = record._id


kf.app.page.openPopup("Popup_rGXjfqqw2", record._id);
  //kf.app.page.openPopup("Popup_rGXjfqqw2");
}
else if ( currentPageID ==='Company_OKR_page_A00'){
  const response = await kf.api("/form/2/"+account_id+"/"+dataformId, {

    method: "POST",
  
    headers: {"Content-Type": "application/json"},
  
    body: JSON.stringify({"Team_Name_Company": kf.user.Name,"Is_this_Company":"Yes","Is_OKR_section_to_be_visible":"Yes","Is_Key_Result_Column_to_be_visible" : "Yes","Is_Team_Name_to_be_visbile":"No","Is_Key_result_table_to_be_visible":"Yes","Created_By":kf.user._id,"Approved_By_email":"Company"})
  
  });
  
  
  let instance_id = response._id
  
  kf.app.page.openPopup("Popup_rGXjfqqw2", record._id);
}
};
 


return (
  <Space
  direction="vertical"
  size="middle"
  style={{
    display: 'flex',
    overflow: 'hidden',
    backgroundColor:'white'
  }}
>
<Row>
      <Col span={12} align="left">
      <Space>   <Image  preview = {false}  src={goals} style={{marginTop:'6px'}} height={16} width={16}></Image>
     <Title level={5} style={{fontFamily:"Inter",marginTop:"13%"}}>Objectives <span style={{color:"gray",fontSize:"12px"}}>({count} items)</span></Title>
     </Space></Col>
     {currentPageID !== "role_executive_api_customisation_A00" && RoleName !== "Employee" &&(
     <Col span={12} align="right"> 
     
  <Button
    size="small"
    type="primary"
    icon={<PlusOutlined />}
    onClick={AddNewOKR}
    style={{ marginTop: "20px", marginRight: "10px" }}
  >
    Add OKR
  </Button></Col>
)}
  </Row>
<div style={ {display:"flex",justifyContent:"space-between"}}>
  <div>
<Button style={{left:"10px", marginRight:"3px"}} type={type} shape="round"  size={"small"} onClick={ShowActive}>
Active
</Button>
 <Button style={{left:"10px", marginLeft:"3px"}}  type={advtype} shape="round"   size={"small"} onClick={ShowComplete}>
 Completed 
</Button>
</div>
{/* <div style={{display:"flex",justifyContent:"end"}}>
    <Space.Compact style={{width:'46%'}}size="large">
    <Input
  addonBefore={<SearchOutlined />}placeholder="Search" value={filterText} onChange={(e) => setFilterText(e.target.value)}
/>
      
    </Space.Compact>
    </div> */}
<div style={{align:'left', marginBottom: '10px', position: 'relative', display:'flex',alignItems:'start',justifyContent:'flex-start' }}>

<FilterComponent filterText={searchQuery} onFilter={(e) => handleSearch(e.target.value)} />
</div>
 </div>
 

<Table 
rowClassName="bg-red"
size='small'

style={{marginLeft: '15px',width:"98%",position:"relative"}}
rowKey={ObjectiveIDs} columns={columns} dataSource={apiResponse?apiResponse.Data:0} pagination={false} 
locale={{emptyText: ( <div style={{ textAlign: 'center',display:emptyicon }}>
 <EmptyState height="160" width="160" />
 <p style={{ fontFamily:"Inter",fontWeight:"600",color:"black",fontSize:"16px"}}>No Assigned OKRs Yet</p>
 <p style={{ fontFamily:"Inter",fontWeight:"400",color:"#545C6B",fontSize:"14px"}}>It looks like you're starting with a clean slate. No OKRs have been assigned to you at the moment. 📝</p>
</div>)}}
loading={{ spinning: loading,
  indicator:  <><Skeleton.Button style={{width:"98%",marginBottom:"1%"}}  size="large" block="TRUE" active="TRUE"/>
  <Skeleton.Button style={{width:"98%",marginBottom:"1%"}} size="large" block="TRUE" active="TRUE"/>
  <Skeleton.Button style={{width:"98%",marginBottom:"1%"}} size="large" block="TRUE" active="TRUE"/>
  <Skeleton.Button style={{width:"98%",marginBottom:"1%"}} size="large"  block="TRUE" active="TRUE"/>
  <Skeleton.Button style={{width:"98%",marginBottom:"1%"}} size="large"  block="TRUE" active="TRUE"/> </>
   }}
   
expandable={{
  expandedRowKeys,
  onExpandedRowsChange: setExpandedRowKeys,
expandIcon:  ({ expanded, onExpand, record }) => {
  const handleClick = async (e) => {
    let kf = window.kf;
    console.log('The Objective id is ', record[ObjectiveIDs]);
    if (!expanded) {
      try {
        const kfResponse = await kf.api(`/form/2/${accountId}/${dataformId}/${record._id}?_application_id=${applicationId}`);
  
  
        const keyResults = kfResponse['Table::Key_Results'];
        setKeyResultsData(keyResults);
        
  
        setExpandedRows((prevRows) => ({
          ...prevRows,
          [record._id]: keyResults, // Store data for this row separately
        }));
  
        // // Make additional API calls for each keyResult
        const additionalDataPromises = keyResults.map(async (keyResult) => {
          try {
            const response = await kf.api(
              `/form-report/2/${accountId}/${dataformId}/${LnkdObjRptId}/count?_application_id=${applicationId}&$parent_objective_id=${record[ObjectiveIDs]}&$parent_key_result_text=${keyResult.Key_Results_1}`
            );
  
            console.log('Additional data API response:', response);
            // Store the response data in a state variable or use it as needed
            setLinkedObjectiveCounts((prevData) => ({
              ...prevData,
              [keyResult.Key_Results_1]: response.Count,
            }));
          } catch (error) {
            console.error('Error fetching additional data:', error);
          }
        });
  
        // // Wait for all additional API calls to complete
        // await Promise.all(additionalDataPromises);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Collapsed');
      handleCollapse(record);

    }
  
    onExpand(record, e);
  };
  
  

  return expanded ? (
    <CaretUpOutlined
      style={{ color: '#61656F', position: "relative", top: "10%" }}
      onClick={handleClick}
    />
  ) : (
    <CaretDownOutlined
      style={{ color: '#61656F', position: "relative", top: "10%" }}
      onClick={handleClick}
    />
  )},
  expandedRowRender: (record) => {
    let kf = window.kf
    const keyResultsData = expandedRows[record._id] || []; // Get data for this row

    

    const jsxElements = [];
//<div style={{height:"32px",width:"90%",left:"3%",position:"relative",background:"#F0F3F7",padding:"6px 24px 6px 24px",marginBottom:"10px",borderRadius:"8px"}}>

  keyResultsData.map((keyResult, index) => {
  //   console.log('keyResult.Key_Results_1', keyResult.Key_Results_1);
   jsxElements.push(
    <div style={{ position: 'relative' }}>
    {/* Horizontal connecting line */}
    <ul>
  <li style={{listStyleType: "none", margin:"10px 0 10px 10px",  
      content: "",
      position: "absolute",
      top:"-37px",
      left:"1px",
      borderLeft: "1.5px solid #ddd",
      borderBottom:"1.5px solid #ddd",
      width:"17px",
      height:"48px"}}>  
  </li>
</ul>
  <div style={{height:"32px",width:"90%",left:"3%",position:"relative",background:"#F0F3F7",padding:"6px 24px 6px 24px",marginBottom:"10px",borderRadius:"8px"}}>
  <img src={keyresultsIcon} width={25} height={25} style={{ verticalAlign: 'middle', padding: '6px', top: '-3px', position: 'relative' }}></img>
  <Tooltip placement="topLeft" title={keyResult.Key_Results_1}> <div style={{width: '25%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block', position: 'relative', top: '4px' }}>{keyResult.Key_Results_1}</div></Tooltip>
    <div style={{ width: '16%', display: 'inline-block', position: 'relative', top: '-3px',color:'#61656C' }}>
  Target: 
  <span style={{ color: 'black' }}>{keyResult.Metrics === 'USD' ? (
    // Display the dollar symbol after the target value for 'USD'
    ` $${new Intl.NumberFormat('en-US').format(Number(keyResult.Targets))}`
  ) : keyResult.Metrics.includes('Thousand') ? (
    // Display 'K' after the target value for 'Thousand'
    ` ${new Intl.NumberFormat('en').format(Number(keyResult.Targets))}K`
  ) : keyResult.Metrics.includes('Million') ? (
    // Display 'M' after the target value for 'Million'
    ` ${new Intl.NumberFormat('en').format(Number(keyResult.Targets))}M`
  ) : keyResult.Metrics.includes('Billion') ? (
    // Display 'B' after the target value for 'Billion'
    ` ${new Intl.NumberFormat('en').format(Number(keyResult.Targets))}B`
  ) : keyResult.Metrics === 'Numeric value' ? (
    // Display target value alone for 'Numerical Value'
    ` ${new Intl.NumberFormat('en').format(Number(keyResult.Targets))}`
  ) : keyResult.Metrics === 'Percentage' ? (
    // Display the percentage symbol after the target value for 'Percentage'
    ` ${new Intl.NumberFormat('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(keyResult.Targets))}%`
  ) : (
    // For any other value of keyResult.Metrics, display the metric and target value with the default number format
    `${keyResult.Metrics} ${new Intl.NumberFormat('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(keyResult.Targets))}`
  )}
  </span>
</div>

<div style={{ width: '16%', display: 'inline-block', position: 'relative', top: '-3px',color: '#61656C' }}>
  Actual: 
  <span style={{ color: 'black' }}>{keyResult.Metrics === 'USD' ? (
    // Display the dollar symbol after the target value for 'USD'
    ` $${new Intl.NumberFormat('en-US').format(Number(keyResult.Actual || 0))}`
  ) : keyResult.Metrics.includes('Thousand') ? (
    // Display 'K' after the target value for 'Thousand'
    ` ${new Intl.NumberFormat('en').format(Number(keyResult.Actual || 0))}K`
  ) : keyResult.Metrics.includes('Million') ? (
    // Display 'M' after the target value for 'Million'
    ` ${new Intl.NumberFormat('en').format(Number(keyResult.Actual || 0))}M`
  ) : keyResult.Metrics.includes('Billion') ? (
    // Display 'B' after the target value for 'Billion'
    ` ${new Intl.NumberFormat('en').format(Number(keyResult.Actual || 0))}B`
  ) : keyResult.Metrics === 'Numeric value' ? (
    // Display target value alone for 'Numerical Value'
    ` ${new Intl.NumberFormat('en').format(Number(keyResult.Actual || 0))}`
  ) : keyResult.Metrics === 'Percentage' ? (
    // Display the percentage symbol after the target value for 'Percentage'
    ` ${new Intl.NumberFormat('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(keyResult.Actual || 0))}%`
  ) : (
    // For any other value of keyResult.Metrics, display the metric and target value with the default number format
    ` ${keyResult.Metrics} ${new Intl.NumberFormat('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(keyResult.Targets))}`
  )}</span>
</div>  
<div style={{ width: '18%', display: 'inline-block', position: 'relative', top: '-3px',color: '#61656C' }}>Progress:   <span style={{ color: 'black' }}>
{keyResult.KR_percentage}%</span></div>

{LinkedObjectiveCounts[keyResult.Key_Results_1] !== undefined && LinkedObjectiveCounts[keyResult.Key_Results_1] !== 0 && (

            <div style={{ textDecoration: 'underline', cursor: 'pointer', width: '16%', display: 'inline-block', position: 'relative', top: '-3px', color: '#61656C' }}
            onClick={() => {console.log('clicked linked ojectives, ', record._id);
            kf.app.setVariable("linkedObjectiveId", record[ObjectiveIDs])
            
                      
                      kf.app.setVariable("linkedParentKeyResult", keyResult.Key_Results_1);
            
                      
                        kf.app.page.openPopup("Popup_XkOu9ZgYv", {
  
                          instance_id: record._id    
            })
          }
            }>
              Linked Obj <span style={{ color: 'black' }}>{LinkedObjectiveCounts[keyResult.Key_Results_1]}</span>
            </div>
          )}
          
    </div>
{/*   
  //     <TreeSelect.TreeNode
  //       title={keyResult.Key_Results_1 }
  //       key={keyResult.Key_Results_1}
  //       style={{
  //         height: "32px",
  //         width: "90%",
  //         left: "3%",
  //         position: "relative",
  //         background: "#F0F3F7",
  //         marginBottom: "10px",
  //         borderRadius: "8px",
  //       }}
  //     >
        
  //     </TreeSelect.TreeNode> */}
    </div>
    );
  });
               
  return jsxElements;


},
  rowExpandable: (record) => record.ObjectiveIDs !== 'Not Expandable',
  

}}


/>
{/* {!loading && (!apiResponse || apiResponse.Data.length === 0) && (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <Image src={EmptyState} alt="No data" />
  </div>
)} */}
<div style={{ display: 'flex', justifyContent: 'end' }}>
  {count !== undefined && count !== 0 && (
    <Pagination
      style={{ marginTop: '10px', marginLeft: '64%' }}
      current={page}
      defaultPageSize={5}
      total={count}
      onChange={handlePageChange}
      showTotal={(total, range) => `Showing ${range[0]}-${range[1]} out of ${total} items`}
    />
  )}
</div>

</Space>

)
}
export default MyFunction;