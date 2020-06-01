export default {
	loginRedirect: "/auth/users/my", // 세션 사용 시 로그인 시도 후 리다이렉션 되는 링크
	github: {
		clientID: "",
		clientSecret: "",
		callbackURL: "/auth/users/login/github/callback",
	},
	naver: {
		clientID: "",
		clientSecret: "",
		callbackURL: "/auth/users/login/naver/callback",
	},
	google: {
		clientID: "",
		clientSecret: "",
		callbackURL: "/auth/users/login/google/callback",
	},
};
