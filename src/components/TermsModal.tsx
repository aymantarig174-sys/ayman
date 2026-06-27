import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'subscriptions'>('products');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:h-[80vh] bg-[#111111] z-50 rounded-3xl shadow-2xl flex flex-col font-sans border border-[#2a2a2a] overflow-hidden"
            style={{ direction: "rtl" }}
          >
            <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center bg-[#0b0b0b] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white">الشروط والأحكام</h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#a8a8a8] hover:text-white p-2 rounded-xl hover:bg-[#1a1a1a] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex p-4 gap-2 bg-[#0b0b0b] border-b border-[#2a2a2a] shrink-0">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === 'products'
                    ? 'bg-white text-black'
                    : 'bg-[#1a1a1a] text-[#a8a8a8] hover:bg-[#242424] hover:text-white'
                }`}
              >
                المنتجات
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === 'subscriptions'
                    ? 'bg-white text-black'
                    : 'bg-[#1a1a1a] text-[#a8a8a8] hover:bg-[#242424] hover:text-white'
                }`}
              >
                الاشتراكات
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-[#a8a8a8] text-sm leading-relaxed space-y-6">
              {activeTab === 'products' ? (
                <>
                  <section>
                    <h3 className="text-white font-bold mb-2">مرحبًا بك في خطفة ستور</h3>
                    <p>وجهتك للحصول على منتجات مختارة بعناية لتجربة تسوق سهلة وسريعة ومريحة.</p>
                    <p>باستخدامك للموقع أو إتمام أي عملية شراء، فإنك توافق على الشروط الموضحة أدناه، والتي وُضعت لضمان تجربة عادلة وواضحة لجميع العملاء.</p>
                  </section>
                  
                  <section>
                    <h3 className="text-white font-bold mb-2">عن المتجر</h3>
                    <p>خطفة ستور متجر إلكتروني يقدم مجموعة متنوعة من المنتجات المختارة بعناية، ونعمل على توفيرها عبر شركاء توريد وخدمات لوجستية موثوقة لضمان وصول المنتجات بأفضل تجربة ممكنة.</p>
                  </section>
                  
                  <section>
                    <h3 className="text-white font-bold mb-2">المنتجات</h3>
                    <p>نحرص على عرض المنتجات بأدق صورة ومواصفات ممكنة، مع ضمان مطابقة المنتج للوصف قدر الإمكان، وقد تختلف بعض التفاصيل البسيطة حسب دفعات التصنيع أو أسلوب العرض، دون أن يؤثر ذلك على جودة المنتج أو استخدامه.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">الأسعار والدفع</h3>
                    <p>جميع الأسعار بالريال السعودي، ويتم تأكيد الطلب بعد إتمام عملية الدفع بنجاح عبر وسائل الدفع المتاحة في الموقع.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">الطلبات</h3>
                    <p>نسعى دائمًا لتجهيز الطلبات بأسرع وقت ممكن، وقد يتم في بعض الحالات:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>تعديل أو إلغاء الطلب عند عدم توفر المنتج</li>
                      <li>أو في حال وجود خطأ في البيانات أو السعر</li>
                      <li>أو صعوبة في إتمام عملية التوصيل</li>
                    </ul>
                    <p className="mt-2">وفي جميع الحالات يتم إشعار العميل والتعامل مع الطلب بما يحفظ حقه بالكامل.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">التوصيل</h3>
                    <p>نوفّر خدمة توصيل سريعة داخل المملكة، وتكون مدة التوصيل المتوقعة بين 4 إلى 7 أيام عمل.</p>
                    <p>قد تختلف المدة بشكل بسيط حسب المدينة أو ظروف الشحن، ونسعى دائمًا لتسليم الطلب بأسرع وقت ممكن.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">تأخير التوصيل والتعويض</h3>
                    <p>نلتزم دائمًا بمحاولة تسليم الطلبات ضمن المدة المحددة، وفي حال حدوث تأخير خارج عن المدة المتوقعة (4 إلى 7 أيام عمل)، فإننا نهتم برضا العميل بشكل كامل.</p>
                    <p>وفي حال تجاوز التأخير المدة المتفق عليها بشكل ملحوظ، قد يتم تعويض العميل إما بخصم جزئي على قيمة الطلب أو تقديم تعويض مناسب حسب حالة الطلب ومدة التأخير، ويتم صرف التعويض بعد استلام الطلب بنجاح.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">سياسة التوفير والتجهيز</h3>
                    <p>نعمل على توفير المنتجات من خلال شبكة من الموردين وشركاء الخدمات اللوجستية، مما يساعدنا على تقديم تنوع في المنتجات وسرعة في التوصيل وجودة في الخدمة.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">الاسترجاع والاستبدال والضمان</h3>
                    <p>نحرص على رضاك الكامل، لذلك نوفر لك سياسة مرنة ومريحة:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>يمكنك طلب الاسترجاع أو الاستبدال خلال 7 أيام من الاستلام</li>
                      <li>شرط أن يكون المنتج بحالته الأصلية وغير مستخدم</li>
                    </ul>
                    <p className="mt-4">كما نوفر ضمان لمدة 90 يومًا يغطي:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>العيوب المصنعية</li>
                      <li>عدم مطابقة المنتج للوصف</li>
                      <li>مشاكل التشغيل غير الناتجة عن الاستخدام</li>
                    </ul>
                    <p className="mt-4">وفي حال وجود أي مشكلة، نوفر لك أحد الحلول التالية:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>استبدال المنتج</li>
                      <li>إصلاحه (إن أمكن)</li>
                      <li>أو استرجاع المبلغ حسب الحالة</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">المنتجات غير القابلة للإرجاع</h3>
                    <p>لضمان السلامة وجودة المنتجات، لا يمكن إرجاع بعض المنتجات مثل:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>المنتجات المستخدمة</li>
                      <li>المنتجات التي تم تعديلها أو تركيبها بشكل غير صحيح</li>
                      <li>المنتجات التي فقدت تغليفها أو ملحقاتها الأساسية</li>
                      <li>المنتجات الصحية أو الشخصية بعد الاستخدام</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">حماية بياناتك</h3>
                    <p>نلتزم بحماية خصوصية بياناتك وعدم مشاركتها إلا مع الجهات اللازمة لإتمام الطلب مثل شركات الشحن أو الدفع، وفق أعلى معايير الأمان.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">الشكاوى والدعم</h3>
                    <p>رضاك هو أولويتنا، لذلك يمكنك التواصل معنا في أي وقت عبر البريد الإلكتروني أو رقم الجوال وسنكون سعداء بمساعدتك بأسرع وقت ممكن.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">التحديثات</h3>
                    <p>قد نقوم بتحديث هذه الشروط عند الحاجة، وسيتم نشر النسخة المحدثة في الموقع، واستمرار استخدامك للموقع يعني موافقتك عليها.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">ملاحظة قانونية</h3>
                    <p>جميع الحقوق محفوظة وفق أنظمة المملكة العربية السعودية، وهذه الشروط تهدف لضمان تجربة شراء عادلة وواضحة لجميع الأطراف.</p>
                  </section>
                </>
              ) : (
                <>
                  <section>
                    <h3 className="text-white font-bold mb-2">مرحبًا بك في خطفة ستور</h3>
                    <p>وجهتك للحصول على اشتراكات وخدمات رقمية مختارة بعناية لتجربة سريعة، سهلة، وفورية.</p>
                    <p>باستخدامك للموقع أو إتمام أي عملية شراء، فإنك توافق على الشروط الموضحة أدناه، والتي تهدف إلى تنظيم استخدام الخدمات وضمان تجربة عادلة وموثوقة لجميع العملاء.</p>
                  </section>
                  
                  <section>
                    <h3 className="text-white font-bold mb-2">عن المتجر</h3>
                    <p>خطفة ستور متجر إلكتروني متخصص في توفير الاشتراكات والخدمات الرقمية، بما في ذلك الخدمات الإلكترونية والعضويات والأدوات الرقمية، عبر حلول توريد رقمية موثوقة لضمان وصول الخدمة بشكل سريع وآمن.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">المنتجات الرقمية</h3>
                    <p>جميع المنتجات والخدمات المعروضة هي منتجات رقمية يتم تسليمها إلكترونيًا بعد إتمام الطلب.</p>
                    <p>قد تختلف تفاصيل الخدمة أو طريقة الاستخدام حسب نوع الاشتراك أو مزود الخدمة، مع الحفاظ على نفس القيمة الأساسية للمنتج المقدم.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">الأسعار والدفع</h3>
                    <p>جميع الأسعار بالريال السعودي، ويتم تأكيد الطلب بعد إتمام عملية الدفع بنجاح عبر وسائل الدفع المتاحة في الموقع.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">التسليم والتفعيل</h3>
                    <p>يتم تسليم المنتجات الرقمية بشكل فوري أو خلال مدة قصيرة بعد تأكيد الطلب.</p>
                    <p>يتم إرسال فاتورة الطلب إلى البريد الإلكتروني الذي تم إدخاله في صفحة الدفع.</p>
                    <p className="mt-2">ولأي استفسار أو متابعة الطلب، يمكن التواصل معنا عبر واتساب أو تيليجرام. نسعى دائمًا لتوفير تجربة تسليم سريعة وسهلة وبدون تعقيد.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">الاشتراكات والخدمات</h3>
                    <p>بعض المنتجات قد تكون:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>اشتراكات شهرية أو سنوية</li>
                      <li>خدمات رقمية لمرة واحدة</li>
                      <li>حسابات أو صلاحيات استخدام مؤقتة حسب نوع الخدمة</li>
                    </ul>
                    <p className="mt-2">ويتم توضيح مدة الخدمة وطبيعتها في صفحة كل منتج.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">سياسة الاسترجاع والاستبدال والضمان</h3>
                    <p>نحرص على رضاك وتجربة استخدام مريحة، لذلك نوفر سياسة دعم مرنة:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>لا يوجد استرجاع بعد استلام الطلب.</li>
                      <li>كما نوفر ضمانًا كاملًا لمدة الخدمة حسب نوع الاشتراك، وفي بعض الحالات يتم توضيح مدة الضمان داخل صفحة المنتج في الموقع.</li>
                    </ul>
                    <p className="mt-4">ويشمل الضمان:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>عدم عمل الخدمة أو الاشتراك</li>
                      <li>مشاكل التفعيل</li>
                      <li>عدم مطابقة الخدمة للوصف</li>
                    </ul>
                    <p className="mt-4">وفي حال وجود مشكلة مثبتة، نوفر أحد الحلول التالية:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>إعادة تفعيل الخدمة</li>
                      <li>استبدال الخدمة بخدمة مشابهة</li>
                      <li>أو تعويض مناسب حسب الحالة</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">المنتجات غير القابلة للإرجاع</h3>
                    <p>نظرًا لطبيعة المنتجات الرقمية، لا يمكن استرجاع أو استبدال الحالات التالية:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 pr-4">
                      <li>الخدمات التي تم استخدامها بالكامل</li>
                      <li>أو تم تفعيلها بنجاح واستُفيد منها</li>
                      <li>أو تم تسليمها بشكل كامل حسب الوصف دون وجود خلل</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">مسؤولية الاستخدام</h3>
                    <p>يتحمل العميل مسؤولية استخدام الخدمة بشكل صحيح وفق التعليمات المرفقة لكل منتج.</p>
                    <p>لا يتحمل خطفة ستور أي مسؤولية عن سوء الاستخدام أو مخالفة شروط مزود الخدمة الخارجي.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">حماية البيانات</h3>
                    <p>نلتزم بحماية بيانات العملاء وعدم مشاركتها إلا بالقدر اللازم لتقديم الخدمة، مثل مزودي الخدمات الرقمية أو أنظمة الدفع، وفق أعلى معايير الأمان والخصوصية.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">الشكاوى والدعم</h3>
                    <p>رضاك هو أولويتنا، لذلك يمكنك التواصل معنا في أي وقت عبر واتساب أو تيليجرام وسنقوم بمساعدتك بأسرع وقت ممكن لضمان تجربة سلسة.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">التحديثات</h3>
                    <p>قد نقوم بتحديث هذه الشروط من وقت لآخر، ويتم نشر النسخة المحدثة في الموقع، واستمرار استخدامك يعني موافقتك على التحديثات.</p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold mb-2">ملاحظة قانونية</h3>
                    <p>جميع الحقوق محفوظة وفق أنظمة المملكة العربية السعودية، وهذه الشروط تهدف إلى تنظيم الخدمة وضمان تجربة آمنة وواضحة لجميع العملاء.</p>
                  </section>
                </>
              )}
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
