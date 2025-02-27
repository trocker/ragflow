import { normFile } from '@/utils/fileUtil';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio, Select, Space, Upload } from 'antd';
import {
  useFetchKnowledgeConfigurationOnMount,
  useSubmitKnowledgeConfiguration,
} from './hooks';

import MaxTokenNumber from '@/components/max-token-number';
import { FormInstance } from 'antd/lib';
import styles from './index.less';

const { Option } = Select;

const ConfigurationForm = ({ form }: { form: FormInstance }) => {
  const { submitKnowledgeConfiguration, submitLoading } =
    useSubmitKnowledgeConfiguration();
  const { parserList, embeddingModelOptions, disabled } =
    useFetchKnowledgeConfigurationOnMount(form);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="validateOnly"
      layout="vertical"
      autoComplete="off"
      onFinish={submitKnowledgeConfiguration}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="name"
        label="Knowledge base name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="avatar"
        label="Knowledge base photo"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
          showUploadList={{ showPreviewIcon: false, showRemoveIcon: false }}
        >
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        </Upload>
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input />
      </Form.Item>
      <Form.Item
        label="Language"
        name="language"
        initialValue={'English'}
        rules={[{ required: true, message: 'Please input your language!' }]}
      >
        <Select placeholder="select your language">
          <Option value="English">English</Option>
          <Option value="Chinese">Chinese</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="permission"
        label="Permissions"
        tooltip="If the permission is 'Team', all the team member can manipulate the knowledgebase."
        rules={[{ required: true }]}
      >
        <Radio.Group>
          <Radio value="me">Only me</Radio>
          <Radio value="team">Team</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="embd_id"
        label="Embedding model"
        rules={[{ required: true }]}
        tooltip="The embedding model used to embedding chunks. It's unchangable once the knowledgebase has chunks. You need to delete all the chunks if you want to change it."
      >
        <Select
          placeholder="Please select a embedding model"
          options={embeddingModelOptions}
          disabled={disabled}
        ></Select>
      </Form.Item>
      <Form.Item
        name="parser_id"
        label="Chunk method"
        tooltip="The instruction is at right."
        rules={[{ required: true }]}
      >
        <Select placeholder="Please select a chunk method" disabled={disabled}>
          {parserList.map((x) => (
            <Option value={x.value} key={x.value}>
              {x.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item noStyle dependencies={['parser_id']}>
        {({ getFieldValue }) => {
          const parserId = getFieldValue('parser_id');

          if (parserId === 'naive') {
            return <MaxTokenNumber></MaxTokenNumber>;
          }
          return null;
        }}
      </Form.Item>
      <Form.Item>
        <div className={styles.buttonWrapper}>
          <Space>
            <Button htmlType="reset" size={'middle'}>
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              size={'middle'}
              loading={submitLoading}
            >
              Save
            </Button>
          </Space>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ConfigurationForm;
