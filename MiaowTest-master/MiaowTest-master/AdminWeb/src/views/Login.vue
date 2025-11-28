<template>
  <el-form-item label="验证码" prop="vcode">
    <Vcode
      :show="isShow"
      @success="onSuccess"
      @close="onClose"
      @fail="onFail"
    />
    <el-button @click="showVcode">点击验证</el-button>
  </el-form-item>
</template>

<script setup>
// 修改验证码验证逻辑：存储后端返回的验证凭证，而非前端直接判断
const loginForm = reactive({
  username: "",
  password: "",
  vcode: "", // 存储验证码验证通过后的凭证（由后端生成）
  vcodeToken: "" // 验证码唯一标识
});

// 验证码验证成功后，获取后端凭证
const onSuccess = async (code) => {
  try {
    // 调用后端接口验证验证码，并获取临时凭证
    const response = await axios.post("/adminapi/verify/captcha", {
      code: code // 验证码结果
    });
    if (response.data.ActionType === "OK") {
      isShow.value = false;
      loginForm.vcodeToken = response.data.data.token; // 存储后端凭证
      loginForm.vcode = "验证通过"; // 仅用于前端显示
    } else {
      ElMessage.error("验证码验证失败");
    }
  } catch (error) {
    console.error("验证码验证失败", error);
    ElMessage.error("验证码验证失败");
  }
};

// 登录提交时验证凭证
const submitForm = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid && loginForm.vcodeToken) { // 验证后端凭证是否存在
      const res = await postUserLogin({
        ...loginForm,
        vcode: loginForm.vcodeToken // 传递后端凭证
      });
      // 后续逻辑保持不变
    } else {
      ElMessage.error("请完成验证码验证");
    }
  });
};
</script>
