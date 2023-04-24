import moment from "moment";
import React,{useState, useEffect} from "react";
import {UnorderedListOutlined,AreaChartOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { Form, Modal, Input, Select, message, Table, DatePicker } from 'antd';
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Layout/Spinner";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
    
    const [showModel, SetShowModel] = useState(false)

    const [loading, setLoading] = useState(false)

    const [allTransection, setAllTransection] = useState([])

    const [frequency, setFrequency] = useState('7')

    const [selectedDate, setSelectedate] = useState([])

    const [type, setType] = useState('all')

    const [viewData, setViewData] = useState('table')

    const [editable, setEditable] = useState(null);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span> 
        },
        {
            title: 'Amount',
            dataIndex: 'amount'
        },
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Category',
            dataIndex: 'category'
        },
        {
            title: 'Refrence',
            dataIndex: 'refrence'
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                  <EditOutlined
                    onClick={() => {
                      setEditable(record);
                      SetShowModel(true);
                    }}
                  />
                  <DeleteOutlined
                    className="mx-2"
                    onClick={() => {
                      handleDelete(record);
                    }}
                  />
                </div>
            )
        },
    ]

    const getAllTransactions = async() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            setLoading(true)
            const res = await axios.post('/transections/get-transection', {
                userid: user._id,
                frequency,
                selectedDate,
                type
            })
            setLoading(false)
            setAllTransection(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
            message.error('Fetch issue with transection')
        }
    }

    useEffect(() => {
        getAllTransactions();
    },[frequency, selectedDate, type])


    const handleDelete = async (record) => {
        try {
          setLoading(true);
          await axios.post("/transections/delete-transection", {
            transacationId: record._id,
          });
          setLoading(false);
          message.success("Transaction Deleted!");
        } catch (error) {
          setLoading(false);
          console.log(error);
          message.error("unable to delete");
        }
      };
    

    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            setLoading(true)
            if (editable) {
                await axios.post("/transections/edit-transection", {
                  payload: {
                    ...values,
                    userId: user._id,
                  },
                  transacationId: editable._id,
                });
                setLoading(false);
                message.success("Transaction Updated Successfully");
            } else {
                await axios.post("/transections/add-transection", {
                ...values,
                userid: user._id,
                });
                setLoading(false);
                message.success("Transaction Added Successfully");
            }
            SetShowModel(false);
            setEditable(null);
        } catch (error) {
            setLoading(false)
            message.error('Failed to add transection')
        }
    }

    return(
        <Layout>
            {loading && <Spinner />}
            <div className="filters">
                <div>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value='7'>Last 1 Week</Select.Option>
                        <Select.Option value='30'>Last 1 Month</Select.Option>
                        <Select.Option value='365'>Last 1 Year</Select.Option>
                        <Select.Option value='custom'>Custom</Select.Option>
                    </Select>
                    {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => 
                            setSelectedate(values)} />}
                </div>
                <div>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value='all'>All</Select.Option>
                        <Select.Option value='income'>Income</Select.Option>
                        <Select.Option value='expense'>Expense</Select.Option>
                    </Select>
                    {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => 
                            setSelectedate(values)} />}
                </div>
                    <div className="switch-icons">
                        <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
                            onClick={() => setViewData('table')}
                            
                         />
                        <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`} 

                            onClick={() => setViewData('analytics')}
                        />
                    </div>
                <div> 
                    <button className="btn btn-primary" onClick={() => SetShowModel(true)}>Add new</button>
                </div>
            </div>
            <div className="content">
                {viewData === 'table' ?  <Table columns={columns} dataSource={allTransection} />
                 : <Analytics  allTransection={allTransection} />}
               
            </div>
            <Modal title={editable ? 'Edit transection' : 'Add Transection'} 
            open={showModel} 
            onCancel={() => SetShowModel(false)}
            footer={false}
            >
                <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
                    <Form.Item label="Amount" name="amount" > 
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="type" name="type" > 
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" name="category" > 
                        <Select>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="project">Project</Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="movie">Movie</Select.Option>
                            <Select.Option value="bills">Bills</Select.Option>
                            <Select.Option value="medical">Medical</Select.Option>
                            <Select.Option value="fee">Fee</Select.Option>
                            <Select.Option value="tax">Tax</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                            
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" name="date" > 
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item label="Refrence" name="refrence" > 
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Description" name="description" > 
                        <Input type="text" />
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">{""}SAVE</button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    )
}

export default HomePage