import database from "./database.js";
import { setSession, getSession, deleteSession } from "./session.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const checkLogin = () => {
    const card_upload_link = document.getElementById("card_upload_link");
    const login_btn = document.getElementById("login_btn");
    const signout_btn = document.getElementById("signout_btn");
    // 로그인 되어있을 때
    if (checkSession()) {
        card_upload_link.classList.remove("hidden");
        login_btn.classList.add("hidden");
        signout_btn.classList.remove("hidden");
        return;
    }
    // 비회원일 때
    card_upload_link.classList.add("hidden");
    login_btn.classList.remove("hidden");
    signout_btn.classList.add("hidden");
}

// 로그인 버튼 이벤트
const onClickSignInFormBtn = () => {    
    const auth = getAuth(database.getApp());
    const email = document.getElementById("signin_id").value;
    const pwd = document.getElementById("signin_pw").value;
    if (email === "" || pwd === ""){
        alert("아이디 또는 비밀번호를 입력해주세요.");
    }
    signInWithEmailAndPassword(auth, email, pwd)
        .then((userCredential) => {
            const user = userCredential.user;
            // 세션에 값 저장
            setSession("uid", user.uid);
            // sign in 페이지 닫기
            checkLogin();
            $("#loginbtn").modal("hide");
            location.reload();
        })
        .catch((error) => {
            alert("계정이 없거나 아이디 또는 비밀번호를 잘못 입력하셨습니다.");
        });
}

// 로그아웃 버튼 이벤트
const onClickSignoutBtn = () => {
    deleteSession();
    checkLogin();
    location.reload();
}

const checkSession = () => {
    if (getSession("uid")) {
        return true;
    }
    return false;
}

const onClickSignInBtn = () => {
    $("#loginbtn").modal("show");
}


export const startHeaderEvent = () => {
    const signout_btn = document.getElementById("signout_btn");
    const signin_form_btn = document.getElementById("signin_form_btn");
    const signin_btn = document.getElementById("login_btn");
    const signin_form = document.getElementById("loginbtn");
    const signin_form_close_btn = document.getElementsByClassName("btn-close")[0];
    checkLogin();

    signin_form.addEventListener("keydown", e => {
        if (e.code === 'Enter')
        onClickSignInFormBtn(e);
    });
    signin_form_close_btn.addEventListener("click", e => {
        $("#loginbtn").modal("hide");
    })
    signin_btn.addEventListener("click", onClickSignInBtn);
    signin_form_btn.addEventListener("click", onClickSignInFormBtn);
    signout_btn.addEventListener("click", onClickSignoutBtn);
}