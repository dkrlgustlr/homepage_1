<?php
declare(strict_types=1);

date_default_timezone_set('Asia/Seoul');

const OFFICE_EMAIL = 'kkkk9628@nate.com';

function jsonResponse(bool $ok, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        'ok' => $ok,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonResponse(false, '잘못된 요청입니다.', 405);
}

function cleanText(string $value, int $maxLength = 500): string
{
    $value = trim(strip_tags($value));
    $value = preg_replace('/[ \t]+/u', ' ', $value) ?? $value;
    $value = preg_replace('/\R{3,}/u', "\n\n", $value) ?? $value;

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    return substr($value, 0, $maxLength);
}

function cleanSingleLine(string $value, int $maxLength = 120): string
{
    return str_replace(["\r", "\n"], ' ', cleanText($value, $maxLength));
}

function encodeSubject(string $subject): string
{
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
    }

    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

$caseType = cleanSingleLine((string)($_POST['case_type'] ?? ''));
$name = cleanSingleLine((string)($_POST['name'] ?? ''));
$phone = cleanSingleLine((string)($_POST['phone'] ?? ''), 40);
$area = cleanSingleLine((string)($_POST['area'] ?? ''));
$message = cleanText((string)($_POST['message'] ?? ''), 1200);
$pageUrl = cleanSingleLine((string)($_POST['page_url'] ?? ''), 300);
$privacyConsent = isset($_POST['privacy_consent']) && trim((string)$_POST['privacy_consent']) !== '';

if ($phone === '') {
    jsonResponse(false, '연락 가능한 전화번호를 입력해주세요.', 422);
}

if (!$privacyConsent) {
    jsonResponse(false, '개인정보 수집 및 이용에 동의해주세요.', 422);
}

if (isset($_POST['company']) && trim((string)$_POST['company']) !== '') {
    jsonResponse(true, '상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.');
}

$host = preg_replace('/[^A-Za-z0-9.-]/', '', (string)($_SERVER['HTTP_HOST'] ?? 'localhost'));
$fromDomain = $host !== '' ? $host : 'localhost.localdomain';
$fromEmail = 'noreply@' . $fromDomain;
$subject = '[법무사 권선기 사무소] 홈페이지 상담 신청';

$bodyLines = [
    '[법무사 권선기 사무소 상담 신청]',
    '접수일시: ' . date('Y-m-d H:i:s'),
    '상담 분야: ' . ($caseType !== '' ? $caseType : '미선택'),
    '이름: ' . ($name !== '' ? $name : '미입력'),
    '전화번호: ' . $phone,
];

if ($area !== '') {
    $bodyLines[] = '지역: ' . $area;
}

if ($message !== '') {
    $bodyLines[] = '';
    $bodyLines[] = '문의내용:';
    $bodyLines[] = $message;
}

$bodyLines[] = '';
$bodyLines[] = '개인정보 수집 및 이용 동의: 동의';
if ($pageUrl !== '') {
    $bodyLines[] = '접수 페이지: ' . $pageUrl;
}

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: Kwonseonki Website <' . $fromEmail . '>',
    'Reply-To: ' . OFFICE_EMAIL,
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail(OFFICE_EMAIL, encodeSubject($subject), implode("\n", $bodyLines), implode("\r\n", $headers));

if (!$sent) {
    jsonResponse(false, '메일 발송에 실패했습니다. 전화 상담으로 문의해주세요.', 500);
}

jsonResponse(true, '상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.');
