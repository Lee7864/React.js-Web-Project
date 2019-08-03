// @flow

import * as React from 'react'
import { View, Text, Spacer } from '../controls'
import styles from '../../styles/StyleGuide.css'

type Props = {
  history: Object,
}

type State = {
}

class PrivacyPage extends React.Component<Props, State> {

  componentDidMount() {
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  linkToOldPage = (pageIndex: string) => {
    this.props.history.push(`/support/privacy?date=${pageIndex}`)
  }

  handleLinkTo180901 = () => {
    this.linkToOldPage('180901')
  }

  render() {
    return (
      <View width='100%' maxWidth={1024} style={styles.dontshrink}>
        <View backgroundColor="white" flex="fill">
          <View border="normal" borderColor="light-gray" borderType="topbottom">
            <View padding="large">
              <Text fontSize="small-medium" fontWeight="bold">에이프릴컴스 개인정보 처리방침</Text>
              <Spacer size="xlarge"/>
              <Text>주식회사 에이프릴컴스(이하 “회사”)는 개인정보 보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령상의 개인정보 보호 규정을 준수하며 개인정보 처리방침을 정하여 회원 권익 보호에 최선을 다하고 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">1. 수집하는 개인정보 항목 및 수집 방법</Text>
              <Spacer size="small"/>
              <Text>회사는 회원가입 및 원활한 서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.</Text>
              <Spacer size="xlarge"/>
              <Text>① 수집하는 개인정보 항목</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 회원가입 : 이메일 주소, 비밀번호</Text>
                  <Spacer size="small"/>
                  <Text>- 주소등록 : 거주지 주소</Text>
                  <Spacer size="small"/>
                  <Text>- 휴대폰 본인확인 : 이름, 휴대폰 번호, 생년월일, 성별, 내/외국인 정보, 가입한 이동 통신사</Text>
                  <Spacer size="small"/>
                  <Text>- 출금계좌 본인 인증 : 금융기관명, 계좌번호, 예금주명</Text>
                  <Spacer size="small"/>
                  <Text>- 추가인증 : 신분증(주민등록번호 제외), 본인확인 관련 영상정보, 입금 거래내역, 송금확인증</Text>
                  <Spacer size="small"/>
                  <Text>- 서비스 이용 관련 항목 : 서비스 이용 기록, 단말기 정보, IP 주소, 회원 상태 정보, 쿠키</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>② 개인정보 수집 방법</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 회원가입 및 서비스 이용과정에서 홈페이지를 통해 회원의 직접 입력을 통해 수집합니다.</Text>
                  <Spacer size="small"/>
                  <Text>- 고객센터를 통한 상담 과정에서 웹페이지, 이메일, 팩스, 전화, 메신저 등을 사용하여 수집합니다.</Text>
                  <Spacer size="small"/>
                  <Text>- 오프라인에서 진행되는 이벤트, 세미나, 간담회 등에서 서면 제출을 통해 수집합니다.</Text>
                  <Spacer size="small"/>
                  <Text>- 기기 정보와 같은 정보는 서비스 이용과정에서 자동으로 생성되어 수집될 수 있습니다.</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">2. 개인정보의 이용</Text>
              <Spacer size="small"/>
              <Text>회사는 회원의 개인정보를 다음과 같은 목적으로만 이용합니다.</Text>
              <Spacer size="xlarge"/>
              <Text>① 회원 관리</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 회원가입 의사 확인, 연령 확인, 회원 식별, 약관 위반 회원 등의 부정이용 방지, 회원탈퇴 의사 확인</Text>
                  <Spacer size="small"/>
                  <Text>- 고객 상담, 고객 불만 접수 및 처리, 분쟁 조정을 위한 기록 보존, 공지사항 전달</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>② 서비스 개선</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 서비스 이용 기록, 서비스 이용 통계, 인구 통계학적 분석</Text>
                  <Spacer size="small"/>
                  <Text>- 회원 관심에 기반한 서비스 기획 및 맞춤형 서비스 제공 등 신규 서비스 요소 발굴</Text>
                  <Spacer size="small"/>
                  <Text>- 보안, 프라이버시, 안전 측면에서 향상된 서비스 이용 환경 구축</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>③ 마케팅 및 프로모션</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 경품행사, 이벤트 등 광고성 정보 전달 또는 회원 참여 공간 운영</Text>
                  <Spacer size="small"/>
                  <Text>- 고객 설문 조사</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">3. 개인정보의 제공</Text>
              <Spacer size="small"/>
              <Text>회사는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우에는 예외적으로 제3자에게 개인정보를 제공합니다. 이 경우에도 필요 최소한의 범위에서 제공함을 원칙으로 합니다.</Text>
              <Spacer size="xlarge"/>
              <Text>① 회원이 제3자 제공에 직접 동의를 한 경우</Text>
              <Spacer size="small"/>
              <Text>② 관련 법령에 의거하여 회사에 개인정보 제출 의무가 발생한 경우</Text>
              <Spacer size="small"/>
              <Text>③ 행정이나 수사 목적으로 법령에 정해진 절차와 방법에 따라 행정 기관이나 수사 기관의 요구가 있는 경우</Text>
              <Spacer size="small"/>
              <Text>④ 회원의 생명이나 안전에 급작스러운 위험이 확인되어 이를 해소하기 위한 경우</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">4. 개인정보의 처리 위탁</Text>
              <Spacer size="small"/>
              <Text>회사는 편리하고 향상된 서비스를 제공하기 위하여 개인정보 처리와 관련된 일부 업무를 아래와 같은 외부 전문업체에 위탁하고 있으며 관련 법령에 따라 위탁받은 업체가 개인정보를 안전하게 처리하도록 필요한 사항을 규정하여 관리하고 있습니다. 회원은 개인정보 처리 위탁에 대한 동의를 거부할 권리가 있습니다. 그러나 동의를 거부할 경우 서비스 이용에 제한을 받을 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text>① 코리아크레딧뷰로㈜ : 휴대폰 본인확인</Text>
              <Spacer size="small"/>
              <Text>② (주)엘지유플러스 : SMS 발송</Text>
              <Spacer size="small"/>
              <Text>③ Amazon Web Service, Inc. : 개인정보 암호화 처리보관</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">5. 개인정보의 보유 및 이용 기간</Text>
              <Spacer size="small"/>
              <Text>회사는 원칙적으로 회원의 개인정보를 회원탈퇴 시 지체없이 파기하고 있습니다. 단, 관련 법령에 의하여 보존할 필요성이 있는 경우에는 해당 기간 동안 개인정보를 안전하게 보관합니다.</Text>
              <Spacer size="xlarge"/>
              <Text>① 통신비밀보호법</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 서비스 이용 관련 개인정보(로그인 기록) : 3개월 보관</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>② 전자상거래 등에서의 소비자 보호에 관한 법률</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 표시/광고에 관한 기록 : 6개월 보관</Text>
                  <Spacer size="small"/>
                  <Text>- 계약 또는 청약철회 등에 관한 기록 : 5년 보관</Text>
                  <Spacer size="small"/>
                  <Text>- 대금결제 및 서비스 등의 공급에 관한 기록 : 5년 보관</Text>
                  <Spacer size="small"/>
                  <Text>- 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년 보관</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>③ 전자금융거래법</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 전자금융 거래에 관한 기록 : 5년 보관</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>④ 정보통신망 이용촉진 및 정보보호 등에 관한 법률</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 본인확인에 관한 기록 : 6개월 보관</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">6. 개인정보의 파기</Text>
              <Spacer size="small"/>
              <Text>① 회사는 수집한 개인정보의 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 의거하여 보관해야 하는 정보는 법령이 정한 기간 동안 보관한 후 파기합니다.</Text>
              <Spacer size="small"/>
              <Text>② 출력물은 분쇄, 소각 또는 화학약품 처리를 통해 용해하여 파기하고 전자적 파일 형태로 관리하는 개인정보는 복구 및 재생이 불가하도록 기술적인 방법을 적용하여 파기합니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">7. 회원의 권리와 행사 방법</Text>
              <Spacer size="small"/>
              <Text>① 회원은 언제든지 홈페이지를 통해 자신의 개인정보를 조회하거나 수정할 수 있습니다. 단, 일부 정보는 수정이 불가할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>② 회원은 언제든지 회원탈퇴 등을 통해 개인정보의 수집 및 이용 동의를 철회할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>③ 개인정보 정정 요청 시 수정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지 않습니다. 잘못된 개인정보를 이미 제3자에게 제공한 경우에는 지체 없이 제공 받은 자에게 통지하여 수정이 이루어질 수 있도록 하겠습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">8. 개인정보 자동 수집 장치의 설치 운영 및 거부에 관한 사항</Text>
              <Spacer size="small"/>
              <Text>회사는 회원의 정보를 수시로 찾아내고 저장하는 ‘쿠키(cookie)’를 운용할 수 있습니다. 회원은 쿠키 설치에 대한 선택권을 가지고 있으며 언제든지 쿠키의 설치나 저장을 거부할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text>① 쿠키의 정의</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 쿠키란 회사의 웹사이트를 운영하는데 이용되는 서버가 회원의 브라우저에 보내는 아주 작은 텍스트 파일로 회원의 컴퓨터에 저장됩니다.</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>② 쿠키의 사용 목적</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 쿠키를 통해 회원이 선호하는 설정 등을 저장하여 보다 빠르고 편리한 이용 환경 지원</Text>
                  <Spacer size="small"/>
                  <Text>- 회원의 취향 및 관심 분야에 따른 타깃 마케팅 및 맞춤 서비스 제공</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>③ 쿠키의 설치 및 저장의 거부 방법</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- Edge : 설정>고급설정>쿠키 수준 설정</Text>
                  <Spacer size="small"/>
                  <Text>- Chrome : 설정>고급>개인정보>쿠키 수준 설정</Text>
                  <Spacer size="small"/>
                  <Text>- Safari : 환경설정>개인정보>쿠키 및 웹사이트 데이터 수준 설정</Text>
                  <Spacer size="small"/>
                  <Text>- Firefox : 설정>개인 정보 및 보안>쿠키와 사이트 데이타 수준 설정</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">9. 개인정보 안정성 확보 조치</Text>
              <Spacer size="small"/>
              <Text>회사는 회원의 개인정보를 안전하게 관리 및 처리하기 위하여 다음과 같이 관리적, 기술적 조치를 시행하고 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text>① 관리적 보호 조치</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 개인정보보호책임자 및 개인정보취급자의 역할과 책임, 개인정보취급자 및 위탁업체에 대한 교육에 관한 사항 등 개인정보보호를 위하여 필요한 사항이 포함된 내부관리계획을 수립하여 시행하고 있습니다.</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>② 기술적 보호조치</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 개인정보를 취급하는 담당자를 최소화하고 개인정보를 처리하는 데이터베이스시스템에 대한 접근 권한의 부여, 변경, 말소를 통해 개인정보에 대한 접근을 통제하고 있습니다.</Text>
                  <Spacer size="small"/>
                  <Text>- 개인정보를 취급하는 담당자들의 업무용 PC에 대해 외부 인터넷망과 내부 인터넷망을 분리하여 개인정보 유출 가능성을 줄이고 있습니다.</Text>
                  <Spacer size="small"/>
                  <Text>- 회원의 개인정보를 암호화된 통신 구간을 통해 전송하고 있으며 비밀번호 등 중요 정보는 암호화하여 보관하고 있습니다.</Text>
                  <Spacer size="small"/>
                  <Text>- 해킹이나 컴퓨터 바이러스 등에 의해 회원의 개인정보가 유출되거나 훼손되는 것을 막기 위해 외부로부터 접근이 통제된 구역에 시스템을 설치하고 있습니다.</Text>
                  <Spacer size="small"/>
                  <Text>- 개인정보의 훼손에 대비해서 자료를 수시로 백업하고 있고 최신 백신 프로그램을 이용하여 회원들의 개인정보나 자료가 유출되거나 손상되지 않도록 방지하고 있습니다.</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">10. 개인정보보호책임자</Text>
              <Spacer size="small"/>
              <Text>회사는 회원의 개인정보 보호 관련 문의 사항 및 불만 처리를 위해 다음과 같이 책임자를 지정하여 운영하고 있습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 이름 : 권재일</Text>
                  <Spacer size="small"/>
                  <Text>- 직책 : 개인정보보호책임자</Text>
                  <Spacer size="small"/>
                  <Text>- 이메일 : support@quanty.com</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">11. 고지 의무</Text>
              <Spacer size="small"/>
              <Text>본 개인정보 처리방침의 추가, 삭제 및 수정이 있을 경우에는 변경 사항 시행 7일 전부터 홈페이지의 ‘공지사항’을 통해 사전 고지할 것입니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 시행 일자 : 2018년 12월 31일</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">이전 개인정보 처리방침 내역은 아래에서 확인 가능합니다.</Text>
              <Spacer size="small"/>
              <View onClick={this.handleLinkTo180901}>
                <Text cursor='pointer'>개인정보처리방침(2018년 9월 1일)</Text>
              </View>
              <Spacer size="xlarge"/>

            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default PrivacyPage