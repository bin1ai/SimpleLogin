<template>
    <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
            <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <!-- <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
            <a-checkbox v-model:checked="formState.remember">记住用户</a-checkbox>
        </a-form-item> -->

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit">登录</a-button>
        </a-form-item>
    </a-form>
</template>

<script lang="ts">
// import { assertExpressionStatement } from '@babel/types';
import { defineComponent, reactive } from 'vue';
import axios, { AxiosError } from "axios";
import type ServerError from 'ant-design-vue/lib/result/serverError';
// import type { Data } from 'ant-design-vue/lib/_util/type';
import { message } from 'ant-design-vue';

interface FormState {
    username: string;
    password: string;
    // remember: boolean;
}

type ServerError = {
    error: string;
};

export default defineComponent({
    setup() {
        const formState = reactive<FormState>({
            username: '',
            password: '',
            // remember: true,
        });

        const onFinish = async (values: any) => {
            console.log('成功: ', values);
            const token = sessionStorage.getItem("token");
            const baseURL = 'http://localhost:7001/api/user/login';
            try {
                const res = await axios.post(
                    baseURL,
                    values,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                        }
                    }
                );
                console.log('返回数据: ', res.data);
                sessionStorage.setItem('token', res.data.token);
                console.log('返回状态码: ', res.data.code);
                console.log('返回信息: ', res.data.message);
                if (res.data.code == 200) {
                    message.success(res.data.message);
                    message.success('Token已经保存');
                } else if (res.data.code == 400) {
                    message.error(res.data.message);
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const serverError = err as AxiosError<ServerError>;
                    if (serverError && serverError.response) {
                        console.log('服务器返回错误: ', serverError.response.data);
                    }
                }
                console.log('服务器出现异常');
            }
        };

        const onFinishFailed = (errorInfo: any) => {
            console.log('失败: ', errorInfo);
        };

        return {
            formState,
            onFinish,
            onFinishFailed,
        };

    },
});
</script>
