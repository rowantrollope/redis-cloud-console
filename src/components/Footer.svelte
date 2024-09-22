<script>
  import { Footer, FooterCopyright, FooterLinkGroup, FooterBrand, FooterLink } from 'flowbite-svelte';
</script>

<Footer footerType="logo">
  <div class="sm:flex sm:items-center sm:justify-between">
    <div class="block dark:hidden">
      <FooterBrand href="https://redis.io" src="/redislogodark.png" alt="Redis Logo" />
    </div>
    <div class="hidden dark:block">
      <FooterBrand href="https://redis.io" src="/redislogo.png" alt="Redis Logo" />
    </div>
    <FooterLinkGroup ulClass="flex flex-wrap font-mono items-center mb-6 text-xs text-gray-500 sm:mb-0 dark:text-gray-400">
      <FooterLink href="/">Trust</FooterLink>
      <FooterLink href="/">Terms of use</FooterLink>
      <FooterLink href="/">Privacy Policy</FooterLink>
    </FooterLinkGroup>
  </div>
  <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
  <FooterCopyright href="/" by="Redis" />
</Footer>