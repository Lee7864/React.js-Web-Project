// @flow

import * as React from 'react'
import { View, Text, Spacer } from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'

type Props = {
}

type State = {
}

class TermsPage extends React.Component<Props, State> {

  componentDidMount() {
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  render() {
    return (
      <View width='100%' maxWidth={1024} style={styles.dontshrink}>
        <View backgroundColor="white" flex="fill">
          <View border="normal" borderColor="light-gray" borderType="topbottom">
            <View padding="large">
              <Text fontSize="small-medium" fontWeight="bold">퀀티 이용약관</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제1조 (목적)</Text>
              <Spacer size="xlarge"/>
              <Text>이 약관은 에이프릴컴스 주식회사(이하 “회사”)가 제공하는 퀀티 및 퀀티 관련 제반 서비스(이하 “서비스”)의 이용에 대해 회사와 회원의 권리, 의무 및 책임 사항 등의 규정을 목적으로 합니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제2조 (약관의 게시 및 개정)</Text>
              <Spacer size="xlarge"/>
              <Text>① 이 약관의 내용은 회원이 쉽게 인지할 수 있도록 홈페이지를 통해 게시되며 회원가입 진행 시, 이용자의 동의를 통해 효력이 발생합니다.</Text>
              <Spacer size="small"/>
              <Text>② 회사는 관련 법령을 위배하지 않는 범위 내에서 이 약관을 개정할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회사가 이 약관을 개정하는 경우에 개정된 약관의 내용을 적용 일자 및 개정 사유와 함께 적용 7일 전(회원에게 불리한 변경의 경우에는 적용 일자 30일 전)부터 홈페이지 초기화면이나 팝업 화면 또는 공지사항을 통해 공지하고 기존 고객에게는 필요 시 이메일 발송 등의 적절한 방법으로 통지합니다.</Text>
              <Spacer size="small"/>
              <Text>④ 회원이 변경된 약관의 효력 발생일까지 약관 변경에 대한 거부 의사를 명시적으로 표시하지 않거나 약관 변경 이후에 서비스를 이용할 경우 회원은 개정된 약관에 동의한 것으로 봅니다.</Text>
              <Spacer size="small"/>
              <Text>⑤ 회원이 변경된 약관에 동의하지 않는 경우, 회원의 서비스 이용이 제한되거나 정지될 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제3조 (약관의 해석)</Text>
              <Spacer size="xlarge"/>
              <Text>이 약관에서 정하지 아니한 사항이나 이 약관의 해석에 대해서는 관련 법령의 규정과 일반 상관례에 따릅니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제4조 (용어의 정의)</Text>
              <Spacer size="xlarge"/>
              <Text>① “회원”이라 함은 회사가 제공하는 서비스의 이용을 목적으로 서비스에 접속하여 이 약관에 동의하고 회원가입을 하여 회사와 서비스 이용계약을 체결한 자를 말합니다.</Text>
              <Spacer size="small"/>
              <Text>② “서비스”라 함은 회원이 이용할 수 있는 퀀티의 가상화폐 거래 서비스 및 관련 제반 서비스를 의미합니다.</Text>
              <Spacer size="small"/>
              <Text>② “아이디(ID 또는 계정)”라 함은 회원이 본 약관에 동의하고 회사가 회원을 식별하고 서비스를 제공하기 위해 요청하여 회원이 등록한 숫자와 문자의 조합을 말합니다.</Text>
              <Spacer size="small"/>
              <Text>③ “별명”이라 함은 회원이 서비스 내에서 사용하는 고유한 이름으로 문자와 숫자의 조합을 말합니다.</Text>
              <Spacer size="small"/>
              <Text>⑤ “가상화폐”라 함은 서비스에서 거래할 수 있는 비트코인, 이더리움 등 암호화된 화폐를 말합니다.</Text>
              <Spacer size="small"/>
              <Text>⑥ “KRW”라 함은 회원이 서비스 내에서 가상화폐 거래 등에 사용하며 현금으로 전환 교환이 가능한 포인트 내지 가상의 화폐를 말합니다.</Text>
              <Spacer size="small"/>
              <Text>⑦ “외부 가상화폐 주소”라 함은 서비스 외부에서 사용하는 모든 가상화폐 주소를 의미하여 외부 가상화폐 주소는 회사에서 소유, 통제 또는 운영하지 않습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제5조 (이용 계약 체결)</Text>
              <Spacer size="xlarge"/>
              <Text>① 이용 계약은 회원이 되고자 하는 자(이하 “가입 신청자”)가 이 약관의 내용에 대해 동의하고 회사가 정한 절차에 따라 가입 신청을 완료한 후 회사가 이러한 신청을 승낙함으로써 체결됩니다.</Text>
              <Spacer size="small"/>
              <Text>② 회사는 필요 시 관련 법령에 따라 전문 기관을 통한 실명확인 및 본인 인증을 요청할 수 있으며 이러한 회사의 요청을 거부하여 본인확인이 되지 않아 발생하게 되는 불이익에 대하여 회사는 어떠한 책임도 부담하지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회사는 가입 신청자의 이용 계약 신청에 대한 검토 결과, 아래 각 호에 해당하는 경우에는 이용 신청을 승낙하지 않을 수 있으며 회원가입 이후에 아래 각 호의 사유가 확인되면 회사는 이용계약을 해지할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 가입 신청자가 이 약관에 의하여 회원자격을 상실한 적이 있는 경우실명이 아닌 명의 또는 타인의 명의를 이용한 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 허위 또는 잘못된 정보를 기재 또는 제공하거나 회사가 요청하는 내용을 기재하지 않은 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 가입 신청자의 귀책 사유로 인하여 승인이 불가능하거나 기타 이 약관에서 규정한 제반 사항을 위반하여 신청하는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 가입 신청자의 나이가 만 19세 미만인 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 기타 위법 또는 부당한 이용신청 등 회사의 합리적인 판단에 의하여 필요하다고 인정되는 경우</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>④ 이용 계약의 성립은 회사의 승낙이 가입 신청자에게 도달된 시점으로 합니다.</Text>
              <Spacer size="small"/>
              <Text>⑤ 실명으로 가입하지 않은 회원은 법적인 보호를 받을 수 없으며 이에 따른 민형〮사상의 모든 책임은 해당 회원이 부담합니다.</Text>
              <Spacer size="small"/>
              <Text>⑥ 회원이 기재하는 모든 회원정보는 실제 데이터인 것으로 간주하며 허위 정보를 기재한 것으로 밝혀질 경우 회사는 서비스 이용을 일시 정지하거나 이용 계약을 해지할 수 있습니다. 이로 인하여 회사 또는 제3자에게 발생한 손해는 회사의 고의 또는 중대한 과실이 없는 한 해당 회원이 모두 책임을 집니다.</Text>
              <Spacer size="small"/>
              <Text>⑦ 이용계약이 체결되면 회사는 이벤트 및 중요 안내사항을 회원의 이메일 주소를 통해 전달합니다. 단, 회원은 회원정보 페이지를 통해 이벤트 및 중요안내 사항에 대한 이메일 수신을 거부할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제6조 (이용 계약 해지)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회원은 언제든지 본인의 의사에 따라 서비스 내 메뉴 또는 고객센터를 통해 이용 계약 해지를 신청할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>② 회사는 다음과 같은 사유가 발생한 경우 회원과 체결한 이용 계약을 해지할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 본 약관을 위반한 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 서비스의 안정적 운영을 저해하는 불법 프로그램 유포, 다량의 정보 전송, 해킹, 접속 권한 초과 행위 등 관련 법령을 위반한 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 회사가 운영하는 서비스의 원활한 운영을 저해하는 행위를 하거나 시도하는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 공공질서 및 미풍양속을 저해할 수 있는 행위를 하는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 타인의 계정 정보로 부정하게 서비스를 이용하는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 기타 위법 또는 부당이용 등 회사가 합리적인 판단에 의하여 서비스 제공을 거부할 필요가 있다고 판단하는 경우</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>③ 전항에 따른 이용 계약 해지 시 서비스 이용을 통해 획득한 모든 혜택이 소멸하며 회사는 고의 또는 중대한 과실이 없는 한 이에 대해 별도로 보상하지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>④ 본 조에 따라 서비스 이용 계약을 해지하는 경우 회사는 해지 사유, 일시 등의 내용을 회원정보에 포함된 이메일 주소 등의 연락처를 통해 통지합니다. 다만, 회사가 긴급하게 이용을 중지해야 할 필요가 있다고 판단하는 경우에는 회원에게 통지하기 전에 서비스 이용을 제한할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>⑤ 회사로부터 이용 계약의 해지 통보를 받은 회원은 이의 신청을 통해 해지 사유가 소명되면 이용 계약을 유지할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>⑥ 이용 계약 해지가 완료되면 관련 법령 및 개인정보 처리방침에 따라 회사가 보유하여야 정보를 제외한 회원의 모든 정보는 삭제됩니다.</Text>
              <Spacer size="small"/>
              <Text>⑦ 회사가 이용 계약을 해지하는 경우 회사는 회원의 이의 신청 접수 및 처리 등을 위하여 일정 기간 동안 회원의 정보를 보관할 수 있으며 해당 기간이 경과한 후에 회원의 정보를 삭제합니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제7조 (회원정보 변경)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회원은 서비스를 통하여 언제든지 본인의 계정 정보를 열람하고 수정할 수 있습니다. 단, 회사의 서비스 제공 및 관리 목적상 일부 정보는 수정이 불가능할 수 있으며 경우에 따라 본인의 정보 수정을 위해 추가 자료를 제출해야 할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>② 회원은 본인의 계정 정보 중 변경된 사항에 대해 서비스에서 직접 수정하거나 고객센터를 통해 회사에 변경 사항을 통지해야 합니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회원이 전항의 변경 사항을 회사에 통지하지 않아 발생한 불이익에 대해 회사는 중대한 사유가 없는 한 책임을 지지 않습니다.</Text>

              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제8조 (회원정보 관리)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회사는 회원의 별명이 다음 각 호에 해당하는 경우 해당 별명의 이용을 제한할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 회원의 별명이 개인정보 유출 우려가 있다고 판단되는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 회원 본인이 아닌 타인으로 오해할 소지가 있다고 판단되는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 반사회적 또는 미풍양속에 어긋나는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 회사 및 회사의 운영자로 오인할 우려가 있다고 판단되는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 제3자의 권리를 침해하는 경우</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>② 회사는 회원이 입력한 계정과 비밀번호 등이 회사에 등록된 정보와 일치하는 경우에는 별도의 확인 절차 없이 이용자를 회원으로 간주합니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회원은 본인의 허가를 받지 않은 제3자가 회원의 계정에 무단으로 접근하는 것을 방지하기 위해 본인의 계정 정보를 안전하게 보관할 책임이 있습니다.</Text>
              <Spacer size="small"/>
              <Text>④ 회원은 계정 정보의 분실, 도용 또는 제3자에게 계정 정보가 공개되었음을 인지한 경우 즉시 회사에 통지하고 회사의 안내를 따라야 합니다. 회사는 즉시 계정 이용중단 등의 조치를 취할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>⑤ 전항의 경우 회사에 그 사실을 통지하지 않거나 통지하더라도 회사의 안내를 따르지 않아 발생한 불이익에 대해 회사의 책임이 제한될 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>⑥ 회원의 계정, 비밀번호 등이 회원의 부주의로 분실, 도용 혹은 공개되어 회원에게 발생한 손해에 대하여 회사는 책임을 부담하지 않습니다. 단, 회사의 고의 또는 과실에 의한 경우에는 그러하지 아니합니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제9조 (개인정보 보호)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회사는 회원의 개인정보를 보호하기 위해 노력하며 개인정보의 보호 및 이용에 대해서는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보 보호법 등 관련 법령 및 회사의 개인정보 처리방침이 적용됩니다. 단, 회사가 구현하여 제공하는 서비스 외에 외부로 링크된 화면 등에 대해서는 회사의 개인정보 처리방침이 적용되지 않습니다.</Text>              <Spacer size="small"/>
              <Spacer size="small"/>
              <Text>② 회원의 원활한 서비스 이용을 위해 회사는 회원의 계정 정보를 회사와 제휴한 업체에 제공 내지 위탁 처리할 수 있습니다. 단, 회사는 회원의 계정 정보 제공에 대한 상세 내용을 회원에게 사전에 공지하고 회원의 동의를 얻어야 합니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제10조 (회사의 의무)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회사는 관련 법령과 본 약관을 준수하며 안정적이고 지속적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.</Text>
              <Spacer size="small"/>
              <Text>② 회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보(신용정보 포함)보호를 위해 보안 시스템을 갖출 수 있으며 개인정보 처리방침을 공시하고 준수합니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회사는 서비스 이용 관련 회원이 제기한 의견이나 불만이 정당하다고 인정되는 경우 이를 처리하여야 하며 회원에게 처리 과정 및 결과를 이메일 등 전자적인 방법으로 전달할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제11조 (회원의 의무)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회원은 관련 법령, 본 약관 및 회사가 고객에게 고지한 모든 지침 내지 정책을 준수하여야 하며 회사의 업무에 방해되는 다음 각 호의 행위를 하여서는 안 됩니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 타인의 정보 도용</Text>
                  <Spacer size="small"/>
                  <Text>- 회사가 게시한 정보의 부당한 변경</Text>
                  <Spacer size="small"/>
                  <Text>- 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</Text>
                  <Spacer size="small"/>
                  <Text>- 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</Text>
                  <Spacer size="small"/>
                  <Text>- 회사 및 기타 제3자의 명예를 손상하거나 업무를 방해하는 행위</Text>
                  <Spacer size="small"/>
                  <Text>- 외설 또는 폭력적인 메시지, 허위사실, 미풍양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</Text>
                  <Spacer size="small"/>
                  <Text>- 회사의 동의 없이 에이전트(Agent), 스크립트(Script), 스파이더(Spider), 스파이웨어(Spyware), 툴바(Toolbar) 등의 자동화된 수단 또는 기타 부정	  한 방법을 통하여 서비스에 접속하는 행위</Text>
                  <Spacer size="small"/>
                  <Text>- 서비스에 연결된 모든 서버, 네트워크 또는 기타 장비에 장애나 중단을 초래할 수 있는 행위</Text>
                  <Spacer size="small"/>
                  <Text>- 다른 회원의 개인정보 및 계정 정보를 수집하는 행위</Text>
                  <Spacer size="small"/>
                  <Text>- 가상화폐의 시세에 부당한 영향을 주는 방법으로 건전한 거래질서를 교란하는 행위</Text>
                  <Spacer size="small"/>
                  <Text>- 기타 불법적이거나 부당한 행위</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>② 회원이 본인에게 적용되는 관련 법령, 본 약관 및 회사가 고객에게 고지한 모든 지침 내지 정책을 위반하여 회사 또는 기타 제3자에게 손해가 발생하는 경우 회원은 회사 또는 기타 제3자에게 발생한 손해를 배상할 책임을 부담할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제12조 (서비스의 제공 등)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회사는 서비스를 영역별로 구분하여 각 영역별 이용 가능 시간을 별도로 설정할 수 있습니다. 단, 이러한 경우에는 그 내용을 사전에 공지합니다.</Text>
              <Spacer size="small"/>
              <Text>② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 하며 다음 각 호의 사유가 발생하는 경우, 회사는 서비스의 제공을 일시적으로 중단할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 서비스 제공과 관련된 설비의 정기점검, 유지보수, 교체 등이 필요한 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 서비스 이용의 폭주 등으로 정상적인 서비스 이용이 어려운 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 기타 서비스 운영상 합리적인 사유가 발생한 경우</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>③ 전항에 따라 서비스를 일시적으로 중단하는 경우 회사는 사전에 서비스 초기 화면이나 등록된 회원의 연락처 등을 활용하여 회원에게 통지합니다. 단, 회사가 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제13조 (서비스의 변경)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회사는 안정적이고 원활한 서비스 제공을 위하여 운영 및 기술적인 측면에서 필요에 따라 서비스의 내용, 운영 정책 등을 변경할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>② 회사는 서비스를 변경할 경우 변경 내용과 적용 일자를 명시하여 사전에 공지하며 회원이 공지 내용을 확인하지 않아 입은 손해에 대하여 회사의 고의 및 중대한 과실이 없는 한 책임지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회원은 서비스 변경 내용에 동의하지 않을 경우 회사에 거부 의사를 표시하고 이용 계약을 해지할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제14조 (서비스의 이용)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회원이 회사가 지정하는 계좌에 현금을 입금하면 회사는 입금한 현금 1원당 1KRW의 비율로 계산한 수량으로 전환하여 회원의 퀀티 지갑에 지급합니다.</Text>
              <Spacer size="small"/>
              <Text>② 회원은 회사가 정하는 방법에 따라 가상화폐 매매 주문을 회사에 제출하여야 합니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회원이 가상화폐 매매 주문 제출 및 체결하기 위해서는 필요한 KRW 또는 가상화폐를 회원의 퀀티 지갑에 보유하고 있어야 합니다.</Text>
              <Spacer size="small"/>
              <Text>④ 회사는 회원이 주문을 제출하기 전에 회원이 매수 또는 매도하려고 하는 가상화폐의 수량, 가격 및 수수료 등을 요약한 주문확인 정보를 제공합니다. 회원은 회사가 이러한 주문확인 정보를 제공하지 못하는 경우에도 회원이 제출한 주문에는 영향을 미치지 않음에 동의합니다.</Text>
              <Spacer size="small"/>
              <Text>⑤ 회원은 가상화폐의 가격 변동에 대해서 회사가 책임지지 않는 것에 동의합니다. 가상화폐 시장의 중단 또는 본 약관 제 18조 제 6항과 같은 불가항력 사건이 발생한 경우 회사는 다음 중 하나 이상의 조치를 수행할 수 있으며 이러한 조치로 인해서 회원에게 발생한 손실에 대해서 회사는 책임을 지지 않습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 서비스에 대한 접근 중단</Text>
                  <Spacer size="small"/>
                  <Text>- 서비스 안에서의 모든 활동 중단</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>⑥ 회원이 보유한 KRW에 대해 회사에 출금을 요청하면 회사는 1KRW당 1원의 비율로 계산한 현금으로 회원이 사전에 등록한 계좌로 지급합니다. 단, 다음 각 호에 해당하는 경우 현금 인출을 제한할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 법원 및 정부 기관의 서면에 의한 요청이 있는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 고객이 범죄 행위 또는 범죄로 인한 수익을 은닉하는 것으로 합리적으로 의심되는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 회사의 운영 정책상 결제 이용을 제한할 필요가 있는 경우</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>⑦ 회사는 현금 및 가상화폐 입출금 시 회원이 제공한 정보가 사실과 일치하는지 확인하기 위하여 관련 법령에 의하여 허용된 범위내에서 전문 기관을 통한 실명확인 또는 본인 인증을 요청할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>⑧ 회원은 퀀티 지갑에 보유한 가상화폐 잔액이 미체결 주문에 해당하는 금액보다 큰 경우 해당 금액에서 수수료를 제외한 금액을 외부 가상화폐 주소로 보낼 수 있습니다. 이 경우, 회원이 제공하는 외부 가상화폐 주소의 정확성에 대한 책임은 회원에게 있으며 회사는 회원이 잘못 기재한 외부 가상화폐 주소로 가상화폐를 보낸 것에 대하여 회사의 고의 또는 중대한 과실이 없는 한 책임지지 않습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제15조 (서비스 이용 관련 유의 사항)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회사는 사전 고지 없이 회사의 재량으로 제출된 주문을 거부하거나 거래 금액 등 거래 조건에 일정한 제한을 둘 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>② 회원은 서비스에 제출한 주문이 체결되기 전에만 주문을 취소할 수 있습니다. 부분적으로 체결된 주문에 대해서는 체결되지 않은 나머지 주문을 취소할 수 있습니다. 회사는 회원이 시장가로 주문을 제출한 경우 이에 대한 취소 요청을 거부할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회원의 퀀티 지갑에서 이용 가능한 가상화폐가 회원이 제출한 주문을 체결시키기 위한 금액에 부족한 경우 회사는 전체 주문을 취소하거나 회원의 퀀티 지갑에서 이용 가능한 가상화폐에 해당하는 주문만 부분적으로 이행할 수 있습니다.</Text>
              <Spacer size="small"/>
              <Text>④ 회사는 서비스에서 회원이 이용할 수 있는 개별 가상화폐 시장을 회사의 재량으로 열거나 닫을 수 있습니다. 특정 가상화폐 시장을 닫는 경우 해당 시장에 남아 있는 미체결 주문은 취소됩니다.</Text>
              <Spacer size="small"/>
              <Text>⑤ 회사는 서비스에서 회원이 이용할 수 있는 개별 가상화폐를 회사의 재량으로 추가하거나 제거할 수 있습니다. 특정 가상화폐가 제거되는 경우 회원은 14일 이내에 해당 가상화폐를 외부 가상화폐 주소로 이동하여 보관해야 하며 회사는 가상화폐 제거와 관련된 손실, 비용 등에 대해서 책임지지 않습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제16조 (서비스 이용 제한)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회사는 다음 각 호에 해당하는 경우 회원의 서비스 로그인을 제한할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 비밀번호 연속 오류가 발생하는 경</Text>
                  <Spacer size="small"/>
                  <Text>- 해킹 및 사기 사고가 발생한 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 타인의 명의도용으로 의심되는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 경찰, 국세청 등 국가 기관과 금융 기관으로부터 회원의 계정이 불법 행위에 이용된 것으로 의심된다는 정보의 제공이 있는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 보이스 피싱 등 범죄 또는 금융 사고 관련성에 합리적인 의심이 드는 경우</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text>② 회사는 다음 각 호에 해당하는 경우 회원의 입출금을 제한할 수 있습니다.</Text>
              <Spacer size="xlarge"/>
              <View flexHorizontal>
                <Spacer size="large"/>
                <View>
                  <Text>- 회원명과 입금자명이 다르게 입금되었을 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 회사가 정한 서비스 이용 권한의 범위를 벗어난 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 회원가입 후 첫 출금액이 과도한 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 거래 및 입출금 형태가 정상적이지 않다고 합리적인 의심이 드는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 경찰, 국세청 등 국가 기관과 금융 기관으로부터 회원의 계정이 불법 행위에 이용된 것으로 의심된다는 정보의 제공이 있는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 보이스 피싱 등 범죄 또는 금융 사고 관련성에 합리적인 의심이 드는 경우</Text>
                  <Spacer size="small"/>
                  <Text>- 기타 회사의 운영 정책상 입금 및 출금 이용을 제한하거나 지연해야 하는 경우</Text>
                </View>
              </View>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제17조 (서비스 수수료)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회원은 회사가 제공하는 가상화폐 거래 서비스, 가상화폐 입출금 서비스 등을 이용하는 경우 수수료를 지급하여야 합니다. 세부적인 서비스별 이용 수수료는 서비스 홈페이지의 수수료 안내 페이지에 명시되어 있습니다.</Text>
              <Spacer size="small"/>
              <Text>② 회사는 회사 및 시장 상황에 따라 수수료를 변경할 수 있으며 수수료 변경이 있는 경우 제 2조 3항의 약관 수정 절차에 준하여 고객에게 사전 통지합니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제18조 (책임 제한)</Text>
              <Spacer size="xlarge"/>
              <Text>① 본 조에서 정하는 회사의 책임 제한 사유는 회원이 계약상 손해배상청구권 등을 행사하고자 하는 경우는 물론 불법행위에 기인한 손해배상청구권 등을 행사하는 경우에도 적용됩니다.</Text>
              <Spacer size="small"/>
              <Text>② 서비스에서 제공하는 콘텐츠는 서비스 이용을 위한 보조 도구이며, 그 어떠한 투자 또는 거래를 권유하거나 암시하지 않습니다. 콘텐츠 및 타 정보제공자가 제공하는 정보는 오류, 지연 및 기타 부정확성이 있을 수 있으며, 이에 대해 회사 및 타 정보제공자는 어떠한 책임도 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>③ 서비스 및 서비스에서 얻은 정보에 따른 투자에는 손실이 발생할 수 있으며, 이에 대한 최종적 판단과 책임은 전적으로 회원에게 있습니다. 회사는 회원의 투자손실에 대해 어떠한 책임도 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>④ 서비스 내에서 회원이 게시한 정보, 의견 및 자료 등은 회사와 아무런 관련이 없으며, 게시물의 내용과 관련하여 발생한 법적 책임은 전적으로 해당 게시물을 게시한 회원 및 이를 열람한 회원에게 있습니다. 회사는 회원간 또는 회원과 제3자 간에 서비스를 매개하여 발생한 분쟁에 관여할 법적 의무가 없으며, 이와 관련하여 어떠한 책임도 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>⑤ 회사는 천재지변, 디도스(DDOS) 공격, IDC 장애, 해킹, 기간통신사업자의 회선 장애 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에 이로 인해 발생하는 회원의 손해에 대해서 회사의 고의 또는 중대한 과실이 없는 한 어떠한 책임도 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>⑥ 관련 법률이 허용하는 한도 내에서 회사는 제3자에 의한 불법적인 회사 서버 접속행위나 기타 서버의 정상적인 운영을 방해하는 행위 또는 회원정보의 무단 사용으로 인해 발생하는 회원의 손해에 대해서 어떠한 책임도 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>⑦ 회사는 가상화폐 발행 관리 시스템 자체의 하자 또는 기술적 한계 등 가상화폐의 특성으로 인하여 불가피하게 발생한 장애, 서비스 제한 등에 대해서 회사의 고의나 중대한 과실이 없는 한 책임을 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>⑧ 회사는 제15조의 경우를 포함하여 서비스 제공을 위하여 회사의 서버를 점검하는 경우 서비스 제공에 관한 책임이 면제 또는 감면됩니다.</Text>
              <Spacer size="small"/>
              <Text>⑨ 회사는 회원의 귀책 사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>⑩ 회사는 회사와 관련 없는 회원이 서비스에 게재한 정보, 자료, 사실의 신뢰도, 정확성, 적법성 등에 관하여는 책임을 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>⑪ 회사는 무료로 제공되는 서비스 이용과 관련하여 관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>⑫ 회원이 서비스를 이용함에 있어 회원 본인이 행한 불법행위나 본 약관 위반행위로 인하여 회사가 해당 회원 이외의 제3자로부터 손해배상 청구 또는 소송을 비롯한 각종 이의제기를 받는 경우 해당 회원은 자신의 책임과 비용으로 반드시 회사를 면책시켜야 합니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제19조 (대리 및 보증의 부인)</Text>
              <Spacer size="xlarge"/>
              <Text>① 회사는 암호화폐를 매도하거나 매수하고자 하는 회원을 대리할 권한을 갖고 있지 않으며 회사의 어떠한 행위도 매도자 또는 매수자의 대리 행위로 간주되지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>② 회사는 회사가 제공하는 서비스를 통하여 이루어지는 회원 간의 매도 및 매수와 관련하여 매도 의사 또는 매수 의사의 사실 및 진위, 적법성에 대하여 보증하지 않습니다.</Text>
              <Spacer size="small"/>
              <Text>③ 회사는 서비스와 연결된 제휴 업체가 운영하는 사이트가 취급하는 상품 또는 용역에 대하여 보증 책임을 지지 않습니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">제20조 (준거법 및 관할법원)</Text>
              <Spacer size="xlarge"/>
              <Text>① 이 약관의 해석 및 적용에 대한 회원과 회사 간 분쟁에 대하여는 대한민국 법을 준거법으로 합니다.</Text>
              <Spacer size="small"/>
              <Text>② 회사와 회원 간 발생한 분쟁에 관한 소송의 관할법원은 회사의 본사 소재지를 관할하는 법원으로 합니다.</Text>
              <Spacer size="xlarge"/>
              <Text fontWeight="bold">부칙</Text>
              <Spacer size="small"/>
              <Text>본 약관은 2018년 9월 1일부터 적용됩니다.</Text>
              <Spacer size="large"/>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default TermsPage;