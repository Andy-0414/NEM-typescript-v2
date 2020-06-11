export default {
	loginRedirect: "/auth/users/my", // 세션 사용 시 로그인 시도 후 리다이렉션 되는 링크
	github: {
		clientID: "" || process.env.GITHUB_CLIENTID,
		clientSecret: "" || process.env.GITHUB_CLIENTSECRET,
		callbackURL: "/auth/users/login/github/callback",
	},
	naver: {
		clientID: "" || process.env.NAVER_CLIENTID,
		clientSecret: "" || process.env.NAVER_CLIENTSECRET,
		callbackURL: "/auth/users/login/naver/callback",
	},
	google: {
		clientID: "" || process.env.GOOGLE_CLIENTID,
		clientSecret: "" || process.env.GOOGLE_CLIENTSECRET,
		callbackURL: "/auth/users/login/google/callback",
	},
	kakao: {
		clientID: "" || process.env.KAKAO_CLIENTID,
		clientSecret: "" || process.env.KAKAO_CLIENTSECRET,
		callbackURL: "/auth/users/login/kakao/callback",
	},
};
