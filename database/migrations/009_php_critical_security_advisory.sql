INSERT INTO blog_posts (
  title, slug, excerpt, category, cover_image, cover_image_alt,
  content_markdown, meta_title, meta_description, ai_prompt, status, published_at
)
VALUES (
  'Critical PHP Security Update: Two Remote Code Execution Flaws and What Hosting Customers Should Do',
  'critical-php-security-update-cve-2026-109618-cve-2026-109619',
  'Two critical PHP vulnerabilities disclosed on 21 October 2026 can enable unauthenticated remote code execution. Learn what to update, how legacy PHP backports work, and what to ask your hosting provider.',
  'Full-Stack Development',
  '',
  'PHP security update guidance for website owners and hosting customers',
  $phpsecurity$
**Updated: 22 October 2026**

Two critical vulnerabilities in the PHP runtime were disclosed on 21 October 2026: **CVE-2026-109618** and **CVE-2026-109619**. The PHP project says both can lead to remote code execution without authentication. This is a runtime-level security issue, not simply a WordPress or plugin vulnerability.

If your website runs PHP, do not assume you are safe because your site uses a familiar CMS, a Linux server, or a PHP version number that has not changed recently. Check the security status of the actual PHP build serving web requests and ask your hosting provider to confirm that the relevant fixes are installed.

## What has been disclosed?

The two vulnerabilities have different causes:

- **CVE-2026-109618 — out-of-memory handling:** under certain request-processing conditions, a memory-allocation failure can leave internal PHP request data in an invalid state. Later cleanup may use that state unsafely.
- **CVE-2026-109619 — stale global state:** request-related internal state can remain referenced after its memory has been freed. A persistent worker may later use that stale state before normal initialisation has reset it.

The PHP security advisories document validated unauthenticated remote-code-execution paths, including a demonstrated Apache `mod_php` path. The second issue also has a documented PHP-FPM path under specified conditions. That does not mean every PHP server has been compromised, but it does mean administrators should treat patching as urgent.

These flaws affect the PHP runtime itself. Updating WordPress, a theme, or a plugin without updating or verifying the underlying PHP runtime is not a sufficient fix.

## Which PHP versions have fixes?

The PHP project's 21 October security announcement lists these fixed releases:

| PHP branch | Fixed release |
| --- | --- |
| PHP 8.5 | 8.5.12 |
| PHP 8.4 | 8.4.27 |
| PHP 8.3 | 8.3.36 |
| PHP 8.2 | 8.2.35 |

If you are on one of these branches, update to the fixed release or a later security release approved for your platform. Confirm the package and build offered by your operating-system vendor or hosting company.

**PHP 8.1 and older need special care.** These branches no longer receive normal security releases from the PHP project. In response to these vulnerabilities, the PHP security team has exceptionally published minimal source backports for PHP 7.4, PHP 8.0 and PHP 8.1. That is useful, but it does not mean those old branches have returned to normal support or are automatically secure.

## What is a security backport?

A backport is a security fix applied to an older software branch without moving the whole installation to a newer major or minor release. For example, a vendor may maintain a PHP 7.4 package and apply the specific security patch while keeping the older version line for compatibility.

This is why **a version number alone does not always tell the whole story**. Linux distributions, managed hosting companies and commercial long-term-support vendors may maintain their own packages and backport security fixes. A package can therefore remain on an older upstream version string while containing a vendor-applied fix.

However, never assume a provider has done this. A backport only helps if the vendor has actually incorporated the relevant patch into the specific build you are running, deployed it to your server, and restarted or replaced affected workers. A general statement that a server is “managed” or “patched” is not proof that both CVEs are covered.

PHP 7.4 is end-of-life upstream. Although the exceptional PHP source backport is available for people building from source, hosting customers should ask for explicit confirmation of the provider's maintained package and both CVE identifiers. A supported PHP upgrade remains the preferred long-term plan.

## What should website owners do now?

1. **Contact your hosting provider today.** Ask whether the PHP runtime serving your site has been patched for CVE-2026-109618 and CVE-2026-109619.
2. **Ask which runtime and build are actually running.** The command-line PHP version can differ from the PHP interpreter used by the website. Shared hosting can also have different versions assigned to different domains.
3. **Ask how legacy versions are handled.** If you use PHP 7.4, 8.0 or 8.1, request the vendor advisory or package changelog showing the backport, and confirmation that it has been deployed.
4. **Confirm worker restarts.** Updating files on disk is not enough if long-running PHP workers still have the old code loaded. The provider should confirm that affected workers and services were restarted or replaced.
5. **Plan to move off end-of-life PHP.** Backports can reduce immediate risk, but they do not restore normal upstream support. Test your site on a currently supported PHP branch and schedule the migration.
6. **Review logs if you suspect compromise.** Unusual multipart POST requests, worker crashes, unexplained memory exhaustion, unexpected child processes, modified files or outbound connections warrant investigation. These are investigation leads, not proof of exploitation.

## Are there temporary mitigations?

The PHP security announcement describes configuration changes that can reduce exposure to particular attack paths, including request-size limits for the out-of-memory issue and disabling session upload-progress handling for a confirmed stale-state path. These measures have operational trade-offs and do **not** make an unpatched runtime safe. They should be implemented by a qualified administrator with reference to the official advisory, not copied blindly into a shared-hosting account.

A web application firewall, a plugin update, hiding PHP error messages, or changing a website's application code should not be treated as a complete substitute for the runtime fix. If a provider cannot patch a high-risk public service promptly, ask about safe isolation or restricting access while the issue is addressed.

## A message you can send to your hosting company

> Hello, I'm checking the security status of the PHP runtime serving my website following the PHP security releases on 21 October 2026. Can you confirm whether the runtime assigned to my account is patched for CVE-2026-109618 and CVE-2026-109619?
>
> Please confirm the actual PHP build and handler used by my website, whether both fixes have been deployed, and whether affected PHP workers have been restarted. If the account is on an older branch such as PHP 7.4, please confirm whether you have a maintained vendor backport covering both CVEs and provide the relevant advisory or package-build details. If an upgrade is required, please advise on a supported version and any compatibility steps.

## Official references

- [PHP security announcement and mitigation guidance](https://www.php.net/archive/2026.php)
- [CIRCL technical advisory: CVE-2026-109618 and CVE-2026-109619](https://circl.lu/pub/tr-102/)
- [PHP supported versions and end-of-life policy](https://www.php.net/supported-versions.php)

**Bottom line:** contact your host, ask specifically about both CVEs, verify the actual serving runtime and any backport, and plan an upgrade if you are still on an end-of-life branch. Do not assume that every hosting company has already patched every server.
$phpsecurity$,
  'Critical PHP Security Update: CVE-2026-109618 and CVE-2026-109619',
  'Two critical PHP RCE flaws disclosed on 21 October 2026. Learn fixed versions, hosting-provider checks, PHP 7.4 backports and urgent remediation steps.',
  'Write a timely, evidence-led security explainer for website owners about PHP CVE-2026-109618 and CVE-2026-109619, fixed versions, vendor backports for legacy branches and practical hosting questions.',
  'published',
  NOW()
);
