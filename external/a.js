import React from '@alipay/bigfish/react';
import { connect } from '@alipay/bigfish/sdk';
import { Form, Input, Modal, Select, Row, Col } from '@alipay/bigfish/antd';
import { formatMessage } from '@alipay/bigfish/locale';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const { Option } = Select;

class TestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      samplesetName: '',
    };
  }

  checkRepetition = e => {
    const { model } = this.props;
    this.props.dispatch({
      type: 'model/queryModelTestName',
      payload: {
        testReportName: e.target.value,
        modelId: model.model_id,
      },
    });
  };

  handleTestDataChange = (value, e) => {
    this.setState({ samplesetName: e.props.children });
  };

  handleOk = () => {
    const {
      form: { validateFields },
      model,
      onOk,
      isEditTestReport,
      id,
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'model/update',
          payload: {
            modelTestNameFlag: 1,
          },
        });
        const newValues = {
          ...values,
          modelId: model.model_id,
          samplesetName: this.state.samplesetName,
          id: isEditTestReport ? id : 'None',
        };
        onOk(newValues);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      model,
      SamplesetNameList = [],
      isEditTestReport,
      modelTestNameFlag,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <Modal
        {...this.props}
        destroyOnClose
        width="40%"
        title={formatMessage({ id: 'markForecast' })}
        onOk={this.handleOk}
      >
        <Form hideRequiredMark>
          {/* 测试模型 */}
          <FormItem {...formItemLayout} label={formatMessage({ id: 'testModel' })}>
            {model.model_name}
          </FormItem>
          {/* 测试报告名称 */}
          {!isEditTestReport && (
            <FormItem {...formItemLayout} label={formatMessage({ id: 'testReportName' })}>
              {getFieldDecorator('testReportName', {
                rules: [{ required: true, message: formatMessage({ id: 'notNull' }) }],
              })(
                <div>
                  <Input
                    placeholder={formatMessage({ id: 'writeTestReportName' })}
                    onBlur={this.checkRepetition}
                  />
                  {!modelTestNameFlag && (
                    <div style={{ color: 'red' }}>
                      <FormattedMessage id="testReportNameRepetition" />
                    </div>
                  )}
                </div>,
              )}
            </FormItem>
          )}
          {/* 测试数据 */}
          <FormItem
            {...formItemLayout}
            label={formatMessage({ id: 'testData' })}
            style={{ marginBottom: '0' }}
          >
            {getFieldDecorator('samplesetId', {
              rules: [{ required: true, message: formatMessage({ id: 'notNull' }) }],
            })(
              <Select
                onChange={(value, e) => this.handleTestDataChange(value, e)}
                placeholder={formatMessage({ id: 'selectTestData' })}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {SamplesetNameList.map(item => (
                  <Option key={item.sampleset_id} value={item.sampleset_id}>
                    {item.sampleset_name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem>
            <Row>
              <Col span={6} />
              <Col span={18} style={{ opacity: 0.45 }}>
                <FormattedMessage id="editTestReportTip" />
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps({ model }) {
  return {
    modelTestNameFlag: model.modelTestNameFlag,
  };
}

export default connect(mapStateToProps)(Form.create()(TestModal));